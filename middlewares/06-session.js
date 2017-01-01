const session = require('koa-generic-session');
const convert = require('koa-convert');
module.exports = convert(session());
