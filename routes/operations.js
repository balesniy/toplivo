const request = require('request-promise-native');
const cheerio = require('cheerio');
module.exports = async function (ctx) {
  const getOptions = {
    uri:                     'http://79.142.89.195:22763/pws/login.do',
    resolveWithFullResponse: true,
  };
  const login = await request(getOptions);
  const [session] = login.headers['set-cookie'][0].split(';');
  let $ = cheerio.load(login.body);
  const postOptions = {
    method:                  'POST',
    uri:                     'http://79.142.89.195:22763/pws/login.do?oper=logon',
    form:                    {
      'org.apache.struts.taglib.html.TOKEN': $('input').val(), // Will be urlencoded
      login:                                 '3226367@mail.ru',
      password:                              'baltimor12',
      langId:                                25
    },
    headers:                 {
      Cookie: session,
    },
    simple:                  false,
    resolveWithFullResponse: true,
  };

  const change = await request(postOptions);
  const [newSession] = change.headers['set-cookie'][0].split(';');
  await request({
    uri:     'http://79.142.89.195:22763/pws/changeSID.do',
    headers: {
      Cookie: newSession,
    }
  });

  const report = await request({
    uri:       'http://79.142.89.195:22763/pws/reportParams.do',
    headers:   {
      Cookie: newSession,
    },
    transform: function (body) {
      return cheerio.load(body);
    },
  });
  const startDate = ctx.request.body.from ? ctx.request.body.from.split('/')[0] : 1;
  const startMonth = ctx.request.body.from ? ctx.request.body.from.split('/')[1] : new Date().getMonth() + 1;
  const startYear = ctx.request.body.from ? ctx.request.body.from.split('/')[2] : new Date().getFullYear();
  const finishDate = ctx.request.body.to ? ctx.request.body.to.split('/')[0] : new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0 ).getDate();
  const finishMonth = ctx.request.body.to ? ctx.request.body.to.split('/')[1] : new Date().getMonth() + 1;
  const finishYear = ctx.request.body.to ? ctx.request.body.to.split('/')[2] : new Date().getFullYear();
  const cardOptions = {
    method:    'POST',
    uri:       'http://79.142.89.195:22763/pws/report.do?createRep=0',
    headers:   {
      Cookie:         newSession,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    transform: function (body) {
      return cheerio.load(body);
    },
    body:      `org.apache.struts.taglib.html.TOKEN=${report('input').val()}&cardsForFilter=${ctx.req.user.number}&allCards=false&extendedReport=false&transactionTypeIds=11&serviceId=-1000&currencyId=-1000&posId=&posName=&_%24datebdate=${startDate}&_%24datebdate=${startMonth}&_%24datebdate=${startYear}&_%24datebdate=00&_%24datebdate=00&_%24datebdate=00&_%24dateedate=${finishDate}&_%24dateedate=${finishMonth}&_%24dateedate=${finishYear}&_%24dateedate=23&_%24dateedate=59&_%24dateedate=59&showIBSTransactions=on&orderReport=2&showSum=on&showCardTotal=on&showCardHolder=on&showTransactions=on&exportOptionID=0`
  };
  const $cardData = await request(cardOptions);
  const tableData = [];
  $cardData('#transactions').find('tr').slice(2).each((i, tr) => {
    tableData.push($cardData(tr).children().map((j, td) => $cardData(td).text()).get());
  });
  ctx.locals.table = tableData.map(([, , place, address, date, , good, , , amount, price]) => {
    return {
      place,
      address,
      date,
      good,
      amount,
      price
    }
  });

  ctx.body = ctx.render('operations');
};