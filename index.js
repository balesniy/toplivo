const Koa = require('koa');
const fs = require('fs');
const path = require('path');
const config = require('config');
require('./libs/passport');
const Router = require('koa-router');
const frontpage = require('./routes/frontpage');
const callback = require('./routes/callback');
const logout = require('./routes/logout');
const user = require('./routes/user');
const balances = require('./routes/balances');
const app = new Koa();
app.keys = [config.secret];

const middlewares = fs.readdirSync(path.join(__dirname, 'middlewares')).sort();

middlewares.forEach(function (middleware) {
  app.use(require('./middlewares/' + middleware));
});

// ---------------------------------------

// can be split into files too

const router = new Router();
router.get('/', frontpage);

// Perform the final stage of authentication and redirect to '/user'
router.get('/callback', callback);
router.get('/user', user);
router.post('/logout', logout);
router.get('/contact', balances);
app.use(router.routes());

// Require authentication for now
app.use(function (ctx, next) {
  if (ctx.isAuthenticated()) {
    return next()
  }
  else {
    ctx.redirect('/')
  }
});

app.listen(3000, () => console.log('listening on port 3000'));