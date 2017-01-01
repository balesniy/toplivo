// Usually served by Nginx
const favicon = require('koa-favicon');

module.exports = favicon(__dirname + '/public/favicon.ico');

