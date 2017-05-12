'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _rawBody2 = require('raw-body');

var _rawBody3 = _interopRequireDefault(_rawBody2);

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

var _common = require('../utils/common');

var common = _interopRequireWildcard(_common);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var middleware = function () {
  var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(ctx, next) {
    var req, rawBody, ip, url, newHeader, _rawBody, options, result, headers, body;

    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            req = ctx.request;

            if (!(req.url === '/api/plugin')) {
              _context.next = 10;
              break;
            }

            _context.next = 4;
            return (0, _rawBody3.default)(ctx.req, {
              length: ctx.length,
              encoding: ctx.charset
            });

          case 4:
            rawBody = _context.sent;

            ctx.body = rawBody;
            _context.next = 8;
            return next();

          case 8:
            _context.next = 28;
            break;

          case 10:
            if (!(req.method === 'POST')) {
              _context.next = 28;
              break;
            }

            ip = _config2.default.forceIp ? _config2.default.forceIp : '223.252.199.7';
            url = 'http://' + ip + req.url;
            newHeader = (0, _extends3.default)({}, req.headers, {
              host: 'music.163.com'
            });
            _context.next = 16;
            return (0, _rawBody3.default)(ctx.req, {
              length: ctx.length,
              encoding: ctx.charset
            });

          case 16:
            _rawBody = _context.sent;
            options = {
              url: url,
              headers: newHeader,
              method: 'post',
              encoding: null,
              gzip: true
            };

            if (_rawBody) {
              options.body = _rawBody;
              try {
                req.body = _rawBody.toString();
              } catch (err) {
                console.log('Body is not string.');
              }
            }
            _context.next = 21;
            return common.sendRequest(options);

          case 21:
            result = _context.sent;
            headers = result.headers;
            body = result.body;
            // console.log(body);

            ctx.set(headers);
            ctx.body = body;
            _context.next = 28;
            return next();

          case 28:
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