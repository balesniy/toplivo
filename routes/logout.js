module.exports = function (ctx) {
  ctx.logout();
  ctx.session = null; // destroy session (!!!)
  ctx.redirect('/');
};
