var app = require('koa')();
var logger = require('koa-logger');

var proxy = require('./modules/proxy');
var modify = require('./modules/modify');

app.use(logger());
app.use(proxy);
app.use(modify);

module.exports = app;
