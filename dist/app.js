'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _koa = require('koa');

var _koa2 = _interopRequireDefault(_koa);

var _koaLogger = require('koa-logger');

var _koaLogger2 = _interopRequireDefault(_koaLogger);

var _proxy = require('./modules/proxy');

var _proxy2 = _interopRequireDefault(_proxy);

var _modify = require('./modules/modify');

var _modify2 = _interopRequireDefault(_modify);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = new _koa2.default();

app.use((0, _koaLogger2.default)());
app.use(_proxy2.default);
app.use(_modify2.default);

exports.default = app;
//# sourceMappingURL=app.js.map