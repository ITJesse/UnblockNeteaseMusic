var colors = require('colors');
var md5 = require('md5');
var request = require('request');

var kugou = function() {};

kugou.prototype.search = function(name, artist, callback) {
  var songName = encodeURIComponent(artist + " - " + name);
  var url = "http://mobilecdn.kugou.com/api/v3/search/song?format=json&keyword=" + songName + "&page=1&pagesize=1&showtype=1";
  request.get(url, function(err, res, body) {
    if (err) {
      console.error(err);
      callback(err);
    } else {
      var data = JSON.parse(body);
      if (data.status == 1) {
        var hash320 = data['data']['info'][0]['320hash'];
        var hash128 = data['data']['info'][0]['hash'];
        if (!!hash320.length) {
          var hash = hash320;
          var bitrate = 320000;
        } else {
          var hash = hash128;
          var bitrate = 128000;
        }
        callback(null, hash, bitrate);
      } else {
        console.error(data['error']);
        callback(data['error']);
      }
    }
  });
}

kugou.prototype.getUrl = function(hash, callback) {
  var key = md5(hash + 'kgcloud');
  var url = "http://trackercdn.kugou.com/i/?acceptMp3=1&cmd=4&pid=6&hash=" + hash + "&key=" + key;
  request.get(url, function(err, res, body) {
    if (err) {
      console.error(err);
      callback(err);
    } else {
      var data = JSON.parse(body);
      if (data.status == 1) {
        var url = data['url'];
        callback(null, url);
      } else {
        console.error(data['error']);
        callback(data['error']);
      }
    }
  });
}

module.exports = kugou;
