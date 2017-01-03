const mongoose = require('mongoose');
const crypto = require('crypto');
const config = require('config');

const userSchema = new mongoose.Schema({
  number:       {
    type:     Number,
    unique:   "Такой номер уже есть, если это вы, то войдите.",
    required: "Требуется номер карты",
    validate: [
      {
        validator: function checkNumber(value) {
          return this.deleted ? true : value.toString().length > 5;
        },
        msg:       'Укажите, пожалуйста, корректный номер.'
      }
    ]
  },
  deleted:      Boolean,
  passwordHash: { // md5(salt + password)
    type:     String,
    required: true
  },
  salt:         { // abc2e4vcdcdsc12345
    required: true,
    type:     String
  }
}, {
  timestamps: true
});

userSchema.virtual('password')
  .set(function (password) {

    if (password !== undefined) {
      if (password.length < 4) {
        this.invalidate('password', 'Пароль должен быть минимум 4 символа.');
      }
    }

    // user.password = 12345
    // console.log(user.password)
    this._plainPassword = password;

    if (password) {
      this.salt = crypto.randomBytes(config.crypto.hash.length).toString('base64');
      this.passwordHash =
        crypto.pbkdf2Sync(password, this.salt, config.crypto.hash.iterations, config.crypto.hash.length, 'sha1');
    }
    else {
      // remove password (unable to login w/ password any more, but can use providers)
      this.salt = undefined;
      this.passwordHash = undefined;
    }
  })
  .get(function () {
    return this._plainPassword;
  });

userSchema.methods.checkPassword = function (password) {
  if (!password) {
    return false;
  } // empty password means no login by password
  if (!this.passwordHash) {
    return false;
  } // this user does not have password (the line below would hang!)

  return crypto.pbkdf2Sync(password, this.salt, config.crypto.hash.iterations, config.crypto.hash.length, 'sha1') == this.passwordHash;
};

module.exports = mongoose.model('User', userSchema);