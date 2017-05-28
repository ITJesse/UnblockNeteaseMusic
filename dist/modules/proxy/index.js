'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

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

            if (!(req.url.indexOf('/api/plugin') !== -1)) {
              _context.next = 18;
              break;
            }

            rawBody = void 0;
            _context.prev = 3;
            _context.next = 6;
            return (0, _rawBody3.default)(ctx.req, {
              length: ctx.length,
              encoding: ctx.charset
            });

          case 6:
            rawBody = _context.sent;
            _context.next = 13;
            break;

          case 9:
            _context.prev = 9;
            _context.t0 = _context['catch'](3);

            console.log('Cannot get post body.'.red);
            throw new Error(_context.t0);

          case 13:
            ctx.body = rawBody;
            _context.next = 16;
            return next();

          case 16:
            _context.next = 44;
            break;

          case 18:
            if (!(req.method === 'POST')) {
              _context.next = 44;
              break;
            }

            ip = _config2.default.forceIp ? _config2.default.forceIp : '223.252.199.7';
            url = 'http://' + ip + req.url;
            newHeader = (0, _assign2.default)({}, req.headers, {
              host: 'music.163.com'
            });
            _context.next = 24;
            return (0, _rawBody3.default)(ctx.req, {
              length: ctx.length,
              encoding: ctx.charset
            });

          case 24:
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
            result = void 0;
            _context.prev = 28;
            _context.next = 31;
            return common.sendRequest(options);

          case 31:
            result = _context.sent;
            _context.next = 38;
            break;

          case 34:
            _context.prev = 34;
            _context.t1 = _context['catch'](28);

            console.log('Cannot get orignal response.'.red);
            throw new Error(_context.t1);

          case 38:
            headers = result.headers;
            body = result.body;
            // console.log(body);

            ctx.set(headers);
            ctx.body = body;
            _context.next = 44;
            return next();

          case 44:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this, [[3, 9], [28, 34]]);
  }));

  return function middleware(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

exports.default = middleware;