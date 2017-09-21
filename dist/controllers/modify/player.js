'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.player = undefined;

require('colors');

var _utils = require('../../utils');

var _dead = require('./dead');

const utils = new _utils.Utils();

const player = exports.player = async (ctx, next) => {
  const data = ctx.body;

  const playbackReturnCode = data.data[0].code;
  const songId = data.data[0].id;

  if (playbackReturnCode === 200) {
    console.log('The song URL is '.green + data.data[0].url);
    return next();
  }

  let songInfo;
  try {
    songInfo = await utils.getSongInfo(songId);
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
  let urlInfo;
  try {
    urlInfo = await utils.getUrlInfo(songInfo);
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
  if (urlInfo) {
    try {
      data.data[0] = await _utils.Netease.modifyPlayerApiCustom(urlInfo, data.data[0]);
    } catch (error) {
      console.log('No resource.'.red);
      throw new Error(error);
    }
  } else {
    console.log('No resource.'.red);
    (0, _dead.handleDeadMusic)(songId, songInfo);
  }
  ctx.body = JSON.stringify(data);
  return next();
};

exports.default = player;