const passport = require('koa-passport');

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});
passport.use(require('./localStrategy'));

module.exports = passport;
