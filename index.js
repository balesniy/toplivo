const Koa = require('koa');
const fs = require('fs');
const path = require('path');
const config = require('config');
require('./libs/passport');
require('./libs/mongoose');
const router = require('koa-router')();
const app = new Koa();
app.keys = [config.secret];
app.proxy = true;

const middlewares = fs.readdirSync(path.join(__dirname, 'middlewares')).sort();

middlewares.forEach(function (middleware) {
  app.use(require('./middlewares/' + middleware));
});

// ---------------------------------------

router.get('/', require('./routes/frontpage'));
router.get('/user', require('./routes/user'));
router.post('/logout', require('./routes/logout'));
router.get('/contact', require('./routes/balances'));
router.get('/balance', require('./routes/balance'));
router.get('/operations', require('./routes/operations'));
router.post('/operations', require('./routes/operations'));
router.get('/payment', require('./routes/payment'));
router.post('/login', require('./routes/login'));
router.post('/register', require('./routes/register').post);
router.get('/register', require('./routes/register').get);
router.get('/verify-email/:verifyEmailToken', require('./routes/verifyEmail').get);
router.get('/admin', require('./routes/admin'));

app.use(router.routes()).use(router.allowedMethods());

// Require authentication for now
app.use(function (ctx, next) {
  if (ctx.isAuthenticated()) {
    return next()
  }
  else {
    ctx.redirect('/')
  }
});

app.listen(process.env.PORT || 3000);