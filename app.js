var express = require('express');
var logger = require('morgan');
var bodyParser = require('body-parser');
var proxy = require('./middleware')

var routes = require('./routes/index');

var app = express();

app.use(logger('dev'));
app.use(bodyParser.raw({
  type: 'application/x-www-form-urlencoded'
}));
app.use(proxy);

app.use('/', routes);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use(function(err, req, res, next) {
  console.error(err);
  res.status(err.status || 500);
  res.send({
    message: err.message,
    error: {}
  });
});


module.exports = app;
