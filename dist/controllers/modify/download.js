'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.download = undefined;

require('colors');

var _utils = require('../../utils');

var _models = require('../../models');

const utils = new _utils.Utils();

const download = exports.download = async (ctx, next) => {
  const data = ctx.body;

  if (_utils.Netease.getDownloadReturnCode(data) === 200) {
    return console.log('The song URL is '.green + data.data.url);
  }
  const songId = _utils.Netease.getDownloadSongId(data);
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
      data.data = await _utils.Netease.modifyDownloadApiCustom(urlInfo, data.data);
    } catch (error) {
      console.log('No resource.'.red);
      throw new Error(error);
    }
  } else {
    console.log('No resource.'.red);
    const { songName, artist, album } = songInfo;
    _models.Song.findOrCreate({
      where: { songId },
      defaults: {
        songId,
        artist,
        album,
        name: songName
      }
    }).then().catch(err => console.log(err));
    _models.Recent.upsert({
      songId
    }).then().catch(err => console.log(err));
  }
  return next();
};

exports.default = download;