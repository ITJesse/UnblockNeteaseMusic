var colors = require('colors');
var request = require('request');
var crypto = require('crypto');

var netease = function(ip) {
  this.baseUrl = "http://" + ip;
};

netease.prototype.getDownloadReturnCode = function(body) {
  body = JSON.parse(body);
  return body["data"]["code"];
};

netease.prototype.getDownloadUrl = function(body) {
  body = JSON.parse(body);
  return body["data"]["url"];
};

netease.prototype.getSongName = function(body) {
  body = JSON.parse(body);
  return body["songs"][0]['name'];
};

netease.prototype.getArtistName = function(body) {
  body = JSON.parse(body);
  return body["songs"][0]['artists'][0]['name'];
};

netease.prototype.getDownloadSongId = function(body) {
  body = JSON.parse(body);
  return body["data"]["id"];
};

netease.prototype.getSongDetail = function(songId) {
  var _this = this;

  var data = [{
    id: songId,
    v: 0
  }];

  var header = {
    'host': 'music.163.com',
    'content-type': 'application/x-www-form-urlencoded'
  };

  var options = {
    url: _this.baseUrl + "/api/song/detail/?ids=[" + songId + "]&id=" + songId,
    headers: header,
    method: 'get',
    gzip: true
  };
  return new Promise((resolve, reject) => {
    request(options, function(err, res, body) {
      if (err) {
        console.error(err.red);
        reject(err);
      } else {
        resolve(body);
      }
    });
  });
};

netease.prototype.modifyPlayerApiCustom = function(urlInfo, body) {
  console.log("Player API Injected".green);

  var _this = this;

  console.log("New URL is ".green + urlInfo.url);
  body["url"] = urlInfo.url;
  body["br"] = urlInfo.bitrate;
  body["code"] = "200";
  body["size"] = urlInfo.filesize;
  body["md5"] = urlInfo.hash;
  body["type"] = "mp3";

  return body;
};

netease.prototype.modifyDownloadApiCustom = function(urlInfo, body) {
  console.log("Download API Injected".green);

  var _this = this;

  body = JSON.parse(body);

  console.log("New URL is ".green + urlInfo.url);
  body["data"]["url"] = urlInfo.url;
  body["data"]["br"] = urlInfo.bitrate;
  body["data"]["code"] = "200";
  body["data"]["size"] = urlInfo.filesize;
  body["data"]["md5"] = urlInfo.hash;
  body["data"]["type"] = "mp3";

  return JSON.stringify(body);
};

module.exports = netease;
