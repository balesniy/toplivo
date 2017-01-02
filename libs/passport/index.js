const passport = require('koa-passport');
const User = require('../../models/user');

passport.serializeUser(function (user, done) {
  done(null, user.id); // uses _id as idField
});

passport.deserializeUser(function (id, done) {
  User.findById(id, done); // callback version checks id validity automatically
});

passport.use(require('./localStrategy'));

module.exports = passport;


