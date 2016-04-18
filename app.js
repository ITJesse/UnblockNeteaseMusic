var app = require('koa')();
var logger = require('koa-logger');
var proxy = require('./proxy');

app.use(logger());
app.use(proxy);

module.exports = app;
