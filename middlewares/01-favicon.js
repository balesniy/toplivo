// Usually served by Nginx
const favicon = require('koa-favicon');
const config = require('config');

module.exports = favicon(config.root + '/public/favicon.ico');

