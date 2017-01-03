module.exports = async function (ctx) {
  if (ctx.isAuthenticated()) {
    ctx.body = ctx.render('payment');
  }
  else {
    ctx.body = ctx.render('login');
  }
};