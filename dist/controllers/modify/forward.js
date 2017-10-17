'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.forward = undefined;

require('colors');

var _player = require('./player');

var _netease = require('../../utils/netease');

const forward = exports.forward = async (ctx, next) => {
  const req = ctx.request;
  if (!Object.prototype.hasOwnProperty.call(req, 'body')) {
    return next();
  }
  let url;
  try {
    const body = _netease.Netease.decryptLinuxForwardApi(req.body.eparams);
    const json = JSON.parse(body);
    url = json.url;
  } catch (err) {
    console.log('Parse body failed.');
    throw new Error(err);
  }
  console.log('API:'.green, url);
  if (url !== 'http://music.163.com/api/song/enhance/player/url') {
    return next();
  }
  return (0, _player.player)(ctx, next);
};

exports.default = forward;