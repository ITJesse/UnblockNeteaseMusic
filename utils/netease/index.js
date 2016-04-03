var colors = require('colors');
var request = require('request');

var netease = function() {
  this.baseUrl = "http://223.252.199.7";
};

netease.prototype.getPlaybackBitrate = function(body) {
  var body = JSON.parse(body);
  return body["data"][0]["br"];
}

netease.prototype.getPlaybackReturnCode = function(body) {
  var body = JSON.parse(body);
  return body["data"][0]["code"];
}

netease.prototype.getPlaybackUrl = function(body) {
  var body = JSON.parse(body);
  return body["data"][0]["url"];
}

netease.prototype.getDownloadBitrate = function(body) {
  var body = JSON.parse(body);
  return body["data"]["br"];
}

netease.prototype.getDownloadReturnCode = function(body) {
  var body = JSON.parse(body);
  return body["data"]["code"];
}

netease.prototype.getDownloadUrl = function(body) {
  var body = JSON.parse(body);
  return body["data"]["url"];
}

netease.prototype.getSongName = function(body) {
  var body = JSON.parse(body);
  return body["songs"][0]['name'];
}

netease.prototype.getArtistName = function(body) {
  var body = JSON.parse(body);
  return body["songs"][0]['ar'][0]['name'];
}

netease.prototype.getPlaybackSongId = function(body) {
  var body = JSON.parse(body);
  return body["data"][0]["id"];
}

netease.prototype.getDownloadSongId = function(body) {
  var body = JSON.parse(body);
  return body["data"]["id"];
}

netease.prototype.getSongDetail = function(songId, callback) {
  var _this = this;

  var data = [{
    id: songId,
    v: 0
  }];

  var header = {
    'host': 'music.163.com',
    'cookie': 'os=pc',
    'content-type': 'application/x-www-form-urlencoded'
  };

  var options = {
    url: _this.baseUrl + "/api/v2/song/detail",
    headers: header,
    method: 'post',
    gzip: true,
    body: "c=" + JSON.stringify(data)
  };
  request(options, function(err, res, body) {
    if (err) {
      console.error(err.red);
      return callback(err);
    } else {
      // console.log(body)
      return callback(null, body);
    }
  });
}

netease.prototype.modifyDetailApi = function(body) {
  console.log("Song Detail API Injected".green);

  return body
    .replace(/\"pl\":\d+/g, '"pl":320000')
    .replace(/\"dl\":\d+/g, '"dl":320000')
    .replace(/\"st\":-?\d+/g, '"st":0')
    .replace(/\"subp\":\d+/g, '"subp":1');
}

netease.prototype.modifyPlayerApiCustom = function(newUrl, bitrate, filesize, body) {
  console.log("Player API Injected".green);

  var _this = this;

  var body = JSON.parse(body);

  var newUrl = newUrl;
  console.log("New URL is ".green + newUrl.green);
  body["data"][0]["url"] = newUrl;
  body["data"][0]["br"] = bitrate;
  body["data"][0]["code"] = "200";
  // body["data"][0]["md5"] = 'efba483eb717cc872436075748bcfcf8';
  body["data"][0]["size"] = filesize;
  body["data"][0]["type"] = "mp3";

  return JSON.stringify(body);
}

netease.prototype.modifyDownloadApiCustom = function(newUrl, bitrate, body) {
  console.log("Download API Injected".green);

  var _this = this;

  var body = JSON.parse(body);

  var newUrl = newUrl;
  console.log("New URL is ".green + newUrl.green);
  body["data"]["url"] = newUrl;
  body["data"]["br"] = bitrate;
  body["data"]["code"] = "200";

  return JSON.stringify(body);
}

module.exports = netease;
