const User = require('../models/user');

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

  ctx.redirect('/');
};
