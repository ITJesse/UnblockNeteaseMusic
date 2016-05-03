var colors = require('colors');
var md5 = require('md5');
var request = require('request');
var co = require('co');

var common = require('../common');

var qq = function() {};

qq.prototype.search = function(name, artist) {
  var _this = this;

  console.log("Search from QQ Music.".green);
  console.log("Song name: ".green + name);
  console.log("Artist: ".green + artist);
  var songName = encodeURIComponent(artist + " " + name);
  var options = {
    url: "http://s.music.qq.com/fcgi-bin/music_search_new_platform?n=1&cr=1&loginUin=0&format=json&inCharset=utf-8&outCharset=utf-8&p=1&catZhida=0&w=" + songName
  };

  return new Promise((resolve, reject) => {
    co(function*() {
      var result = yield common.sendRequest(options);
      var data = JSON.parse(result[1]);
      if (data.code == 0 &&
        data.data.song.list.length > 0 &&
        data.data.song.list[0].fsong.indexOf(name) != -1) {

        var list = data.data.song.list[0].f.split('|');
        var result = {
          url: 'http://music.163.com/qqmusic/' + list[0] + '.mp3',
          bitrate: list[13],
          filesize: list[11],
          hash: null
        }
        console.log(result);
        return resolve(result);
      } else {
        console.log("No resource found from QQ Music".yellow);
        return resolve(null);
      }
    }).catch((err) => {
      console.log(err);
      reject(err);
    });
  });
};

module.exports = qq;
