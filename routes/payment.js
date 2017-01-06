const Payment = require('../models/payment');

exports.get = async function (ctx) {
  if (ctx.isAuthenticated()) {
    ctx.body = ctx.render('payment');
  }
  else {
    ctx.body = ctx.render('login');
  }
};
exports.post = async function(ctx) {
  const {sum, good, user} = ctx.request.body;
  const payment = await Payment.create({sum, good, user});
  ctx.body={id: payment._id};
};