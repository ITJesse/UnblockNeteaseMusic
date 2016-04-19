var colors = require('colors');
var netease = require('./netease');
var kugou = require('./kugou');
var co = require('co');

var utils = function(ip) {
  this.netease = new netease(ip);
  this.kugou = new kugou();
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

      // search 'Artist Songname' on kugou
      var songName = _this.netease.getSongName(detail);
      var artist = _this.netease.getArtistName(detail);
      var songInfo = yield _this.kugou.search(songName, artist);

      if (songInfo) {
        // get song url from kugou
        var bitrate = songInfo.bitrate;
        var filesize = songInfo.filesize;
        var hash = songInfo.hash;
        var url = yield _this.kugou.getUrl(hash);
      } else {
        // if no resource found on kugou fallback to netease low-res api
        var quality = _this.netease.getFallbackQuality(detail);
        if (!!quality) {
          // get song url from netease
          var bitrate = quality.bitrate.toString();
          var filesize = quality.size.toString();
          var dfsId = quality.dfsId.toString();
          var url = _this.netease.generateFallbackUrl(dfsId);
        }
      }
      if (url) {
        var result = {
          bitrate: bitrate,
          filesize: filesize,
          url: url,
          hash: hash ? hash : null
        }
        resolve(result);
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
