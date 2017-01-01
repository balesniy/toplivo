//const passport = require('koa-passport');

module.exports = async function (ctx) {
  if (ctx.isAuthenticated()) {
    ctx.body = ctx.render('user');
  }
  else {
    ctx.body = ctx.render('login');
  }
};



