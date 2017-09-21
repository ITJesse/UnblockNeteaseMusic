'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handleDeadMusic = undefined;

var _models = require('../../models');

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

exports.default = handleDeadMusic;