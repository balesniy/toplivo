const User = require('../models/user');
module.exports = async function (ctx) {
  if (ctx.isAuthenticated()) {
    const users = await User.find({});
    ctx.body = ctx.render('admin', {
      users: users.map(user => user.getPublicFields())
    })
  }
  else {
    ctx.body = ctx.render('login');
  }
};