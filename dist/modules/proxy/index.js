'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

var _rawBody = require('raw-body');

var _rawBody2 = _interopRequireDefault(_rawBody);

var _extend = require('extend');

var _extend2 = _interopRequireDefault(_extend);

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var sendRequest = function sendRequest(options) {
  var defaults = {
    method: 'get',
    followRedirect: false,
    timeout: 10000
  };
  options = (0, _extend2.default)(false, defaults, options);
  return new _promise2.default(function (resolve, reject) {
    (0, _request2.default)(options, function (err, res, body) {
      if (err) {
        reject(err);
      } else {
        resolve([res, body]);
      }
    });
  });
};

// 封装 request post
var post = function post(url, headers, body) {
  var options = {
    url: url,
    headers: headers,
    method: 'post',
    gzip: true
  };
  if (!!body) {
    options.body = body;
  }

  return new _promise2.default(function (resolve, reject) {
    sendRequest(options).then(function (res) {
      return resolve(res);
    }).catch(function (err) {
      return reject(err);
    });
  });
};

var middleware = function _callee(ctx, next) {
  var req, res, ip, url, rawBody, result, headers, body;
  return _regenerator2.default.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          req = ctx.request;
          res = ctx.reponse;

          if (!(req.method == 'POST')) {
            _context.next = 20;
            break;
          }

          ip = _config2.default.forceIp ? _config2.default.forceIp : '223.252.199.7';
          url = 'http://' + ip + req.url;

          req.headers['host'] = 'music.163.com';

          _context.next = 8;
          return _regenerator2.default.awrap((0, _rawBody2.default)(ctx.req, {
            length: ctx.length,
            encoding: ctx.charset
          }));

        case 8:
          rawBody = _context.sent;
          _context.next = 11;
          return _regenerator2.default.awrap(post(url, req.headers, rawBody));

        case 11:
          result = _context.sent;
          headers = result[0].headers;
          body = result[1];

          delete headers['content-encoding'];
          // console.log(body);
          ctx.set(headers);
          ctx.defaultBody = body;

          // console.log("before: " +  ctx.defaultBody);
          _context.next = 19;
          return _regenerator2.default.awrap(next());

        case 19:
          // console.log("after: " +  ctx.defaultBody);

          ctx.body = ctx.defaultBody;

        case 20:
        case 'end':
          return _context.stop();
      }
    }
  }, null, this);
};

exports.default = middleware;
//# sourceMappingURL=index.js.map