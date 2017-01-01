const request = require('request-promise-native');
const cheerio = require('cheerio');
module.exports = async function (ctx) {
  const getOptions = {
    uri:                     'http://79.142.89.195:22763/pws/login.do',
    resolveWithFullResponse: true,
  };
  const login = await request(getOptions);
  const session = login.headers['set-cookie'][0].split(';')[0];
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
  const newSession = change.headers['set-cookie'][0].split(';')[0];
  await request({
    uri:     'http://79.142.89.195:22763/pws/changeSID.do',
    headers: {
      Cookie: newSession,
    }
  });
  await request({
    uri:     'http://79.142.89.195:22763/pws/main.do',
    headers: {
      Cookie: newSession,
    },
  });

  const report = await request({
    uri:       'http://79.142.89.195:22763/pws/reportCardBalanceParams.do',
    headers:   {
      Cookie: newSession,
    },
    transform: function (body) {
      return cheerio.load(body);
    },
  });

  const allCardsOptions = {
    method:  'POST',
    uri:     'http://79.142.89.195:22763/pws/reportCardBalanceParams.do?createRep=0',
    headers: {
      Cookie:         newSession,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body:    `org.apache.struts.taglib.html.TOKEN=${report('input').val()}&cardsForFilter=&allCards=true&_%24datebdatecb=1&_%24datebdatecb=11&_%24datebdatecb=2016&_%24datebdatecb=00&_%24datebdatecb=00&_%24datebdatecb=00&_%24dateedatecb=30&_%24dateedatecb=11&_%24dateedatecb=2016&_%24dateedatecb=23&_%24dateedatecb=59&_%24dateedatecb=59&exportOptionID=0`
  };
  const allCards = await request(allCardsOptions);
  const tableData = [];
  $ = cheerio.load(allCards);
  $('#cardBalance').find('tr').slice(1).each((i, tr) => {
    tableData.push($(tr).children().map((j, td) => $(td).text()).get());
  });
  let card;
  const table = tableData.map(([a, , b, , , , , c]) => {
    card = card || a;
    return {
      card,
      good:   b,
      amount: parseFloat(c)
    }
  }).filter(({ amount }) => amount);
  const goodsAmount = {};
  table.forEach(({ good, amount }) => {
    goodsAmount[good] = (goodsAmount[good] || 0) + amount;
  });
  ctx.locals.goodsAmounts = goodsAmount;
  ctx.body = ctx.render('balances');
};