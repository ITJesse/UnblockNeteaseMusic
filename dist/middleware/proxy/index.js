'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.proxy = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _zlib = require('zlib');

var _zlib2 = _interopRequireDefault(_zlib);

var _config = require('../../config');

var _config2 = _interopRequireDefault(_config);

var _utils = require('../../utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const proxy = exports.proxy = async function (ctx, next) {
  const req = ctx.request;

  if (req.url.indexOf('/api/plugin') !== -1) {
    ctx.body = req.rawBody;
    await next();
  } else if (req.method === 'POST') {
    const ip = _config2.default.forceIp ? _config2.default.forceIp : '223.252.199.7';
    const url = `http://${ip}${req.url}`;

    const newHeader = _extends({}, req.headers, {
      host: 'music.163.com',
      'x-real-ip': `202.114.79.${Math.floor(Math.random() * 255) + 1}`
    });

    const options = {
      url,
      headers: newHeader,
      method: 'post',
      encoding: null,
      gzip: true
    };
    if (req.rawBody) {
      options.body = req.rawBody;
    }
    let result;
    try {
      result = await (0, _utils.sendRequest)(options);
    } catch (err) {
      console.log('Cannot get orignal response.'.red);
      throw new Error(err);
    }

    const headers = result.headers;
    const body = result.body;
    ctx.body = body.toString();
    // console.log(ctx.body);
    await next();

    if (typeof ctx.body === 'object') {
      ctx.body = JSON.stringify(ctx.body);
    }
    if (typeof ctx.body === 'string') {
      ctx.compress = true;
      const stream = _zlib2.default.createGzip();
      stream.end(ctx.body);
      ctx.body = stream;
      headers['content-encoding'] = 'gzip';
    } else {
      delete headers['content-encoding'];
    }
    // console.log(headers);
    ctx.set(headers);
    // console.log(ctx.body);
  }
};

exports.default = proxy;