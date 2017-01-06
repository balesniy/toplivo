const User = require('../models/user');
exports.get = async function (ctx) {
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

exports.del = async function (ctx) {
  ctx.body = await User.findByIdAndRemove(ctx.params.id);
};