'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.checkPairMusic = exports.handleDeadMusic = undefined;

var _models = require('../../models');

var _utils = require('../../utils');

const utils = new _utils.Utils();

const handleDeadMusic = exports.handleDeadMusic = (songId, songInfo) => {
  const { songName, artist, album, albumPic } = songInfo;
  _models.Song.findOrCreate({
    where: { songId },
    defaults: {
      songId,
      artist,
      album,
      albumPic,
      name: songName
    }
  }).then().catch(err => console.log(err));
  _models.Recent.upsert({
    songId
  }).then().catch(err => console.log(err));
};

const checkPairMusic = exports.checkPairMusic = async songId => {
  let pair;
  try {
    pair = await _models.Pair.findOne({ where: { songId } });
  } catch (err) {
    throw new Error(err);
  }
  if (pair) {
    let urlInfo;
    try {
      urlInfo = await utils.getUrlInfoForPair(pair.dataValues);
    } catch (err) {
      throw new Error(err);
    }
    return urlInfo;
  }
  return null;
};

exports.default = handleDeadMusic;