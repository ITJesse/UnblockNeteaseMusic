#!/usr/bin/env node
'use strict';

var _app = require('../app');

var _app2 = _interopRequireDefault(_app);

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _colors = require('colors');

var _colors2 = _interopRequireDefault(_colors);

var _config = require('../modules/config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Get port from environment and store in Express.
 */

/**
 * Module dependencies.
 */

var port = _config2.default.port || '8123';

/**
 * Create HTTP server.
 */

var server = _http2.default.createServer(_app2.default.callback());

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
  console.log('Listening on '.yellow + bind.yellow);
}