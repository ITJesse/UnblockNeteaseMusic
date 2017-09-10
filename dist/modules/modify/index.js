'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.forward = exports.download = exports.player = undefined;

require('colors');

var _utils = require('../utils');

var _utils2 = _interopRequireDefault(_utils);

var _netease = require('../utils/netease');

var _netease2 = _interopRequireDefault(_netease);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const utils = new _utils2.default();

const player = exports.player = async (ctx, next) => {
  const data = ctx.body;

  const playbackReturnCode = data.data[0].code;
  const songId = data.data[0].id;

  if (playbackReturnCode === 200) {
    console.log('The song URL is '.green + data.data[0].url);
    return next();
  }

  let urlInfo;
  try {
    urlInfo = await utils.getUrlInfo(songId);
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
  if (urlInfo) {
    try {
      data.data[0] = await _netease2.default.modifyPlayerApiCustom(urlInfo, data.data[0]);
    } catch (error) {
      console.log('No resource.'.red);
      throw new Error(error);
    }
  } else {
    console.log('No resource.'.red);
  }
  ctx.body = JSON.stringify(data);
  return next();
};

const download = exports.download = async (ctx, next) => {
  const data = ctx.body;

  if (_netease2.default.getDownloadReturnCode(data) === 200) {
    return console.log('The song URL is '.green + data.data.url);
  }
  const songId = _netease2.default.getDownloadSongId(data);
  let urlInfo;
  try {
    urlInfo = await utils.getUrlInfo(songId);
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
  if (urlInfo) {
    try {
      data.data = await _netease2.default.modifyDownloadApiCustom(urlInfo, data.data);
    } catch (error) {
      console.log('No resource.'.red);
      throw new Error(error);
    }
  } else {
    console.log('No resource.'.red);
  }
  return next();
};

const forward = exports.forward = async (ctx, next) => {
  const req = ctx.request;
  if (!Object.prototype.hasOwnProperty.call(req, 'body')) {
    return next();
  }
  let url;
  try {
    const body = _netease2.default.decryptLinuxForwardApi(req.body.split('=')[1]);
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
  return player(ctx, next);
};