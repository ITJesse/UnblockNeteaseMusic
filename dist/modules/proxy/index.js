'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _rawBody = require('raw-body');

var _rawBody2 = _interopRequireDefault(_rawBody);

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

var _common = require('../utils/common');

var common = _interopRequireWildcard(_common);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var middleware = function () {
  var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(ctx, next) {
    var req, ip, url, rawBody, options, result, headers, body;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            req = ctx.request;

            if (!(req.method === 'POST')) {
              _context.next = 21;
              break;
            }

            ip = _config2.default.forceIp ? _config2.default.forceIp : '223.252.199.7';
            url = 'http://' + ip + req.url;

            req.headers.host = 'music.163.com';

            _context.next = 7;
            return (0, _rawBody2.default)(ctx.req, {
              length: ctx.length,
              encoding: ctx.charset
            });

          case 7:
            rawBody = _context.sent;


            delete req.headers['x-real-ip'];
            options = {
              url: url,
              headers: req.headers,
              method: 'post',
              encoding: null,
              gzip: true
            };

            if (rawBody) {
              options.body = rawBody;
              try {
                req.body = rawBody.toString();
              } catch (err) {
                console.log('Body is not string.');
              }
            }
            _context.next = 13;
            return common.sendRequest(options);

          case 13:
            result = _context.sent;
            headers = result.headers;
            body = result.body;

            delete headers['content-encoding'];
            // console.log(body);
            ctx.set(headers);
            ctx.body = body;
            _context.next = 21;
            return next();

          case 21:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function middleware(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

exports.default = middleware;