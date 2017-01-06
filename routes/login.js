const passport = require('koa-passport');

module.exports = function (ctx, next) {
  return passport.authenticate('local', async function (err, user) {
    if (user === false) {
      ctx.body = { success: false };
      ctx.throw(401)
    }
    else {
      await ctx.login(user);
      ctx.body = ctx.render('welcome');
    }
  })(ctx, next)
};

