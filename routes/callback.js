const passport = require('koa-passport');

module.exports = function (ctx, next) {
  return passport.authenticate('auth0', function (err, user) {
    if (user === false) {
      ctx.body = { success: false };
      ctx.throw(401)
    }
    else {
      ctx.body = { user };
      return ctx.login(user)
    }
  })(ctx, next);

};

