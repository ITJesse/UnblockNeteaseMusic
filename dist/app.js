'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

require('colors');

var _koa = require('koa');

var _koa2 = _interopRequireDefault(_koa);

var _koaLogger = require('koa-logger');

var _koaLogger2 = _interopRequireDefault(_koaLogger);

var _koaRoute = require('koa-route');

var _koaRoute2 = _interopRequireDefault(_koaRoute);

var _config = require('./modules/config');

var _config2 = _interopRequireDefault(_config);

var _proxy = require('./modules/proxy');

var _proxy2 = _interopRequireDefault(_proxy);

var _modify = require('./modules/modify');

var modify = _interopRequireWildcard(_modify);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = new _koa2.default();

app.use((0, _koaLogger2.default)());
app.use(_proxy2.default);
app.use(function () {
  var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(ctx, next) {
    var data;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            data = ctx.body;
            _context.prev = 1;

            ctx.body = JSON.parse(ctx.body.toString());
            _context.next = 5;
            return next();

          case 5:
            _context.next = 12;
            break;

          case 7:
            _context.prev = 7;
            _context.t0 = _context['catch'](1);

            if (_config2.default.verbose) {
              console.log(_context.t0);
            }
            ctx.body = data;
            console.log('Modify failed.'.red);

          case 12:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined, [[1, 7]]);
  }));

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}());
app.use(_koaRoute2.default.post('/eapi/song/enhance/player/url', modify.player));
app.use(_koaRoute2.default.post('/eapi/song/enhance/download/url', modify.download));
app.use(_koaRoute2.default.post('/api/linux/forward', modify.forward));
app.use(_koaRoute2.default.post('/api/plugin', modify.player));
app.use(_koaRoute2.default.post('/api/plugin/player', modify.player));
app.use(_koaRoute2.default.post('/api/plugin/download', modify.download));

exports.default = app;