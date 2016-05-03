var colors = require('colors');
var md5 = require('md5');
var request = require('request');
var co = require('co');

var common = require('../common');

var kugou = function() {};

kugou.prototype.search = function(name, artist) {
  console.log("Search from Kugou.".green);
  console.log("Song name: ".green + name);
  console.log("Artist: ".green + artist);
  var songName = encodeURIComponent(artist + " " + name);
  var options = {
    url: "http://mobilecdn.kugou.com/api/v3/search/song?format=json&keyword=" + songName + "&page=1&pagesize=1&showtype=1"
  };

  return new Promise((resolve, reject) => {
    co(function*() {
      var result = yield common.sendRequest(options);
      var data = JSON.parse(result[1]);
      if (data.status == 1 &&
        !!data['data']['info'].length &&
        !!data['data']['info'][0]['320hash'].length &&
        data['data']['info'][0]['songname'].indexOf(name) != -1) {

        var hash320 = data['data']['info'][0]['320hash'];
        var result = {
          hash: hash320,
          bitrate: 320000,
          filesize: data['data']['info'][0]['320filesize']
        };
        return resolve(result);
      } else {
        console.error('No resource found on kugou.'.yellow)
        return resolve(null);
      }
    }).catch((err) => {
      console.log(err);
      reject(err);
    });
  });
};

kugou.prototype.getUrl = function(hash) {
  var key = md5(hash + 'kgcloud');
  var options = {
    url: "http://trackercdn.kugou.com/i/?acceptMp3=1&cmd=4&pid=6&hash=" + hash + "&key=" + key
  };

  return new Promise((resolve, reject) => {
    co(function*() {
      var result = yield common.sendRequest(options);
      var data = JSON.parse(result[1]);
      if (data.status == 1) {
        var url = data['url'];
        resolve(url);
      } else {
        console.error(data['error']);
        reject(data['error']);
      }
    }).catch((err) => {
      console.log(err);
      reject(err);
    });
  });
};

module.exports = kugou;
