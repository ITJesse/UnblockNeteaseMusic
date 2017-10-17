'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

require('colors');

var _koa = require('koa');

var _koa2 = _interopRequireDefault(_koa);

var _koaLogger = require('koa-logger');

var _koaLogger2 = _interopRequireDefault(_koaLogger);

var _koaRouter = require('koa-router');

var _koaRouter2 = _interopRequireDefault(_koaRouter);

var _koaBasicAuth = require('koa-basic-auth');

var _koaBasicAuth2 = _interopRequireDefault(_koaBasicAuth);

var _koaBodyparser = require('koa-bodyparser');

var _koaBodyparser2 = _interopRequireDefault(_koaBodyparser);

var _kcors = require('kcors');

var _kcors2 = _interopRequireDefault(_kcors);

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

var _middleware = require('./middleware');

var _controllers = require('./controllers');

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const errorHandler = async (ctx, next) => {
  const data = ctx.body;
  let json = '';
  try {
    json = JSON.parse(ctx.body.toString());
  } catch (error) {
    console.log('Pares failed. Maybe encrypted.');
    ctx.body = data;
    return;
  }
  if (Array.isArray(json.data)) {
    json.data = json.data.map(e => _utils.Netease.fixJsonData(e));
  } else if (json.data) {
    json.data = _utils.Netease.fixJsonData(json.data);
  } else {
    json = _utils.Netease.fixJsonData(json);
  }
  try {
    ctx.body = json;
    await next();
  } catch (err) {
    if (_config2.default.verbose) {
      console.log(err);
    }
    ctx.body = json;
    console.log('Modify failed.'.red);
  }
};

const app = new _koa2.default();
app.use((0, _koaLogger2.default)());
app.use((0, _kcors2.default)());
app.use((0, _koaBodyparser2.default)());

const router = (0, _koaRouter2.default)();

// Route for native netease client
router.post('/eapi/song/enhance/player/url', _middleware.proxy, errorHandler, _controllers.modify.player);
router.post('/api/plugin/player', _middleware.proxy, errorHandler, _controllers.modify.player);
router.post('/eapi/song/enhance/download/url', _middleware.proxy, errorHandler, _controllers.modify.download);
router.post('/api/plugin/download', _middleware.proxy, errorHandler, _controllers.modify.download);
router.post('/api/linux/forward', _middleware.proxy, errorHandler, _controllers.modify.forward);

// Route for Unblock Netease Music Server itself
if (_config2.default.webApi) {
  router.use('/api/pair/*', (0, _koaBasicAuth2.default)({
    name: _config2.default.username,
    pass: _config2.default.password
  }));

  router.get('/api/pair/check', _controllers.pair.check).get('/api/pair/recent', _controllers.pair.recent).get('/api/pair', _controllers.pair.list).put('/api/pair', _controllers.pair.save).delete('/api/pair/:songId', _controllers.pair.unpair).get('/api/pair/:songId', _controllers.pair.get);
}

app.use(router.routes()).use(router.allowedMethods());

exports.default = app;