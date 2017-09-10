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

var _config = require('./modules/config');

var _config2 = _interopRequireDefault(_config);

var _proxy = require('./modules/proxy');

var _proxy2 = _interopRequireDefault(_proxy);

var _netease = require('./modules/utils/netease');

var _netease2 = _interopRequireDefault(_netease);

var _modify = require('./modules/modify');

var modify = _interopRequireWildcard(_modify);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import * as pair from './modules/pair';

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
    json.data = json.data.map(e => _netease2.default.fixJsonData(e));
  } else {
    json.data = _netease2.default.fixJsonData(json.data);
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

const router = (0, _koaRouter2.default)();

// Route for native netease client
router.post('/eapi/song/enhance/player/url', _proxy2.default, errorHandler, modify.player);
router.post('/api/plugin/player', _proxy2.default, errorHandler, modify.player);
router.post('/eapi/song/enhance/download/url', _proxy2.default, errorHandler, modify.download);
router.post('/api/plugin/download', _proxy2.default, errorHandler, modify.download);
router.post('/api/linux/forward', _proxy2.default, errorHandler, modify.forward);

// Route for Unblock Netease Music Server itself
// router
//   .use('/api/pair/*', pair.permission)
//   .get('/api/pair/recent', pair.recent)
//   .get('/api/pair', pair.list)
//   .put('/api/pair', pair.save)
//   .post('/api/pair/:songId', pair.update);

app.use(router.routes()).use(router.allowedMethods());

exports.default = app;