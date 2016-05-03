var colors = require('colors');
var co = require('co');

var config = require('../config');
var netease = require('./netease');
var kugou = require('./kugou');
var dongting = require('./dongting');
var qq = require('./qq');

var utils = function(ip) {
  var ip = config.forceIp ? config.forceIp : '223.252.199.7';

  this.netease = new netease(ip);
  this.kugou = null;
  this.dongting = null;

  if (config.kugou) {
    this.kugou = new kugou();
  }
  if (config.dongting) {
    this.dongting = new dongting();
  }
  if (config.qq) {
    this.qq = new qq();
  }
}

/*
  Get song url from kugou.
  If failed, fallback to netease low-res api.
*/

utils.prototype.getUrlInfo = function(songId) {
  var _this = this;

  return new Promise((resolve, reject) => {
    co(function*() {
      // get song detail by song id from netease
      var detail = yield _this.netease.getSongDetail(songId);
      var songName = _this.netease.getSongName(detail);
      var artist = _this.netease.getArtistName(detail);
      var songInfo = null;

      if (_this.kugou) {
        // search 'Artist Songname' on kugou
        songInfo = yield _this.kugou.search(songName, artist);
        if (songInfo) {
          songInfo.url = yield _this.kugou.getUrl(songInfo.hash);
        }
      }

      if (!songInfo && _this.qq) {
        songInfo = yield _this.qq.search(songName, artist);
      }

      if (!songInfo && _this.dongting) {
        songInfo = yield _this.dongting.search(songName, artist);
      }

      if (songInfo) {
        resolve(songInfo);
      } else {
        resolve(null);
      }
    }).catch((err) => {
      console.log(err);
      reject(err);
    });
  })
}

module.exports = utils;
