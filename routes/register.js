const User = require('../models/user');
const sendMail = require('../libs/sendMail');
const config = require('config');

exports.get = function (ctx) {
  ctx.body = ctx.render('register');
};

exports.post = async function (ctx) {
  const verifyEmailToken = Math.random().toString(36).slice(2, 10);
  const user = new User({
    number:   ctx.request.body.number,
    password: ctx.request.body.password,
    email: ctx.request.body.email.toLowerCase(),
    verifiedEmail: false,
    verifyEmailToken: verifyEmailToken,
  });

  try {
    await user.save();
  } catch (e) {
    if (e.name == 'ValidationError') {
      let errorMessages = "";
      for (let key in e.errors) {
        errorMessages += `${key}: ${e.errors[key].message}<br>`;
      }
      ctx.flash('error', errorMessages);
      ctx.redirect('/register');
      return;
    }
    else {
      ctx.throw(e);
    }
  }

  // We're here if no errors happened

  await sendMail({
    template: 'verify-registration-email',
    to: user.email,
    subject: "Подтверждение email",
    link: config.server.siteHost + '/verify-email/' + verifyEmailToken
  });

  ctx.body = 'Вы зарегистрированы.';

};
