var colors = require('colors');
var netease = require('./netease');
var kugou = require('./kugou');
var waterfall = require("async/waterfall");

var utils = function(ip) {
  this.netease = new netease(ip);
  this.kugou = new kugou();
}

utils.prototype.getUrlInfo = function(songId, index, callback) {
  var _this = this;
  waterfall([
    function(cb) {
      _this.netease.getSongDetail(songId, function(err, detail) {
        if (err) {
          cb(err);
          console.error(err);
        } else {
          cb(null, detail);
        }
      });
    },
    function(detail, cb) {
      var songName = _this.netease.getSongName(detail);
      var artist = _this.netease.getArtistName(detail);
      _this.kugou.search(songName, artist, function(err, hash, bitrate, filesize) {
        if (err) {
          var quality = _this.netease.getFallbackQuality(detail);
          if(!!quality){
            cb(null, 'netease', null, quality.bitrate.toString(), quality.size.toString(), quality.dfsId.toString());
          }else{
            cb('No resource.')
          }
        } else {
          cb(null, 'kugou', hash, bitrate, filesize, null);
        }
      });
    },
    function(type, hash, bitrate, filesize, dfsId, cb) {
      switch (type) {
        case 'netease':
          var url = _this.netease.generateFallbackUrl(dfsId);
          cb(null, url, null, bitrate, filesize);
          break;
        case 'kugou':
          _this.kugou.getUrl(hash, function(err, url) {
            if (err) {
              cb(err);
              console.error(err);
            } else {
              cb(null, url, hash, bitrate, filesize);
            }
          });
          break;
      }
    }
  ], function(err, url, hash, bitrate, filesize) {
    if (err) {
      console.error(err.red);
      callback(err);
    } else {
      callback(null, url, hash, bitrate, filesize, index);
    }
  });
}

module.exports = utils;
