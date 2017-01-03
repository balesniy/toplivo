const User = require('../models/user');

exports.get = function (ctx) {
  ctx.body = ctx.render('register');
};

exports.post = async function (ctx) {
  const user = new User({
    number:   ctx.request.body.number,
    password: ctx.request.body.password,
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

  ctx.body = 'Вы зарегистрированы.';

};
