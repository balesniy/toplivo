const passport = require('koa-passport');

module.exports = function (ctx, next) {
  return passport.authenticate('local', function (err, user) {
    if (user === false) {
      ctx.body = { success: false };
      ctx.throw(401)
    }
    else {
      ctx.login(user);
      ctx.body = ctx.render('welcome');
    }
  })(ctx, next)
};

