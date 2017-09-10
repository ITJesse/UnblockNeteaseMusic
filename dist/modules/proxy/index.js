'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _rawBody = require('raw-body');

var _rawBody2 = _interopRequireDefault(_rawBody);

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

var _common = require('../utils/common');

var common = _interopRequireWildcard(_common);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const middleware = async function (ctx, next) {
  const req = ctx.request;

  if (req.url.indexOf('/api/plugin') !== -1) {
    let rawBody;
    try {
      rawBody = await (0, _rawBody2.default)(ctx.req, {
        length: ctx.length,
        encoding: ctx.charset
      });
    } catch (error) {
      console.log('Cannot get post body.'.red);
      throw new Error(error);
    }
    ctx.body = rawBody;
    await next();
  } else if (req.method === 'POST') {
    const ip = _config2.default.forceIp ? _config2.default.forceIp : '223.252.199.7';
    const url = `http://${ip}${req.url}`;

    const newHeader = _extends({}, req.headers, {
      host: 'music.163.com',
      'x-real-ip': `202.114.79.${Math.floor(Math.random() * 255) + 1}`
    });

    const rawBody = await (0, _rawBody2.default)(ctx.req, {
      length: ctx.length,
      encoding: ctx.charset
    });

    const options = {
      url,
      headers: newHeader,
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
    let result;
    try {
      result = await common.sendRequest(options);
    } catch (err) {
      console.log('Cannot get orignal response.'.red);
      throw new Error(err);
    }

    const headers = result.headers;
    const body = result.body;
    delete headers['content-encoding'];
    ctx.set(headers);
    ctx.body = body.toString();
    await next();
    // console.log(ctx.body);
  }
};

exports.default = middleware;