const passport = require('../libs/passport');

// - инициализовать this.req._passport (вспомогательный контекст, нам не понадобится)
// - сделать на this методы
//   this.login(user)
//   this.logout()
//   this.isAuthenticated()
// @see https://github.com/rkusa/koa-passport/blob/master/lib/framework/koa.js
// @see https://github.com/jaredhanson/passport/blob/master/lib/middleware/initialize.js
module.exports = passport.initialize();
