const User = require('../models/user');
const request = require('request-promise-native');
const cheerio = require('cheerio');
exports.get = async function (ctx) {

  const user = await User.findOne({
    verifyEmailToken: ctx.params.verifyEmailToken
  });

  if (!user) {
    ctx.throw(404, 'Ссылка подтверждения недействительна или устарела.');
  }

  user.verifiedEmailsHistory.push({
    date:  new Date(),
    email: user.email
  });

  if (!user.verifiedEmail) {
    user.verifiedEmail = true;
    await user.save();
  }
  else {
    ctx.throw(404, 'Изменений не произведено: ваш email и так верифицирован, его смена не запрашивалась.');
  }

  delete user.verifyEmailToken;

  await ctx.login(user);
  //------------------------------
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
    uri:       'http://79.142.89.195:22763/pws/reportCardBalanceParams.do',
    headers:   {
      Cookie: newSession,
    },
    transform: function (body) {
      return cheerio.load(body);
    },
  });

  const cardOptions = {
    method:  'POST',
    uri:     'http://79.142.89.195:22763/pws/reportCardBalanceParams.do?createRep=0',
    headers: {
      Cookie:         newSession,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    transform: function (body) {
      return cheerio.load(body);
    },
    body:    `org.apache.struts.taglib.html.TOKEN=${report('input').val()}&cardsForFilter=${ctx.req.user.number}&allCards=false&_%24datebdatecb=1&_%24datebdatecb=1&_%24datebdatecb=2017&_%24datebdatecb=00&_%24datebdatecb=00&_%24datebdatecb=00&_%24dateedatecb=31&_%24dateedatecb=1&_%24dateedatecb=2017&_%24dateedatecb=23&_%24dateedatecb=59&_%24dateedatecb=59&exportOptionID=0`
  };
  const $cardData = await request(cardOptions);

  const tableData = $cardData('tr').slice(1).get().map(function (el) {
    return $cardData(el).children().map(function () {return $cardData(this).text()}).get()
  });
  user.goods = tableData.map(([, , good]) => good);
  await user.save();
  ctx.redirect('/');
};


