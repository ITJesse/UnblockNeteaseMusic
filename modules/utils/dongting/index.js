var colors = require('colors');
var md5 = require('md5');
var request = require('request');
var co = require('co');

var common = require('../common');

var dongting = function() {};

dongting.prototype.qualityFallback = function(data) {
  var result = {};
  if (!!data.ll_list && data.ll_list.length > 0) {
    result = {
      url: data.ll_list[0].url,
      bitrate: data.ll_list[0].bitRate * 1000,
      filesize: parseFloat(data.ll_list[0].size) * 1024,
      hash: null
    }
  } else {
    var index = data.audition_list.length - 1;
    result = {
      url: data.audition_list[index].url,
      bitrate: data.audition_list[index].bitRate * 1000,
      filesize: Math.ceil(parseFloat(data.audition_list[index].size) * 1024 * 1024),
      hash: null
    }
  }
  return result;
};

dongting.prototype.search = function(name, artist) {
  var _this = this;

  console.log("Search from TianTianDongTing.".green);
  console.log("Song name: ".green + name);
  console.log("Artist: ".green + artist);
  var songName = encodeURIComponent(artist + " " + name);
  var options = {
    url: "http://search.dongting.com/song/search/old?page=1&size=1&q=" + songName
  };

  return new Promise((resolve, reject) => {
    co(function*() {
      var result = yield common.sendRequest(options);
      var data = JSON.parse(result[1]);
      if (data.code == 1 &&
        data.data.length > 0 &&
        data.data[0].song_name.indexOf(name) != -1) {

        var result = _this.qualityFallback(data.data[0]);
        return resolve(result);
      } else {
        console.log("No resource found from dongting".yellow);
        return resolve(null);
      }
    }).catch((err) => {
      console.log(err);
      reject(err);
    });
  });
};

module.exports = dongting;
