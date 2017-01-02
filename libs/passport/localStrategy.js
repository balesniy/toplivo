let LocalStrategy = require('passport-local');
let User = require('../../models/user');

// Стратегия берёт поля из req.body
// Вызывает для них функцию
module.exports = new LocalStrategy(
  function (username, password, done) {
    User.findOne({ number: username }, function (err, user) {
      if (err) {
        return done(err);
      }

      if (!user || !user.checkPassword(password)) {
        // don't say whether the user exists
        return done(null, false, { message: 'Нет такого пользователя или пароль неверен.' });
      }
      return done(null, user);
    });
  }
);
