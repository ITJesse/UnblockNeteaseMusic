var colors = require('colors');
var request = require('request');
var crypto = require('crypto');

var netease = function(ip) {
  this.baseUrl = "http://" + ip;
};

netease.prototype.getPlaybackBitrate = function(body, index) {
  var body = JSON.parse(body);
  return body["data"][index]["br"];
}

netease.prototype.getPlaybackReturnCode = function(body, index) {
  var body = JSON.parse(body);
  return body["data"][index]["code"];
}

netease.prototype.getPlaybackUrl = function(body, index) {
  var body = JSON.parse(body);
  return body["data"][index]["url"];
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
  return body["songs"][0]['artists'][0]['name'];
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
    'content-type': 'application/x-www-form-urlencoded'
  };

  var options = {
    url: _this.baseUrl + "/api/song/detail/?ids=[" + songId + "]&id=" + songId,
    headers: header,
    method: 'get',
    gzip: true,
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

netease.prototype.getEncId = function(dfsId){
  var byte1 = new Buffer('3go8&$8*3*3h0k(2)2');
  var byte2 = new Buffer(dfsId);
  var byte1_len = byte1.length;
  for(var i=0; i<byte2.length; i++){
    byte2[i] = byte2[i]^byte1[i%byte1_len];
  }
  var md5 = crypto.createHash('md5').update(byte2).digest('base64');
  var result = md5.replace(/\//g, '_').replace(/\+/g, '-');
  return result;
}

netease.prototype.getFallbackQuality = function(pageContent) {
  var body = JSON.parse(pageContent);

  // Downgrade if we don't have higher quality...
  var nQuality = 'hMusic';
  if (nQuality == "hMusic" && !!!body["songs"][0]["hMusic"]) {
    nQuality = "mMusic";
  }
  if (nQuality == "mMusic" && !!!body["songs"][0]["mMusic"]) {
    nQuality = "lMusic";
  }
  if (nQuality == "lMusic" && !!!body["songs"][0]["lMusic"]) {
    nQuality = "bMusic";
  }
  if (nQuality == "bMusic" && !!!body["songs"][0]["bMusic"]) {
    nQuality = "audition";
  }

  if (nQuality == "audition" && !!!body["songs"][0]["audition"]) {
    console.log('No resource found on netease.'.yellow)
  }

  return body["songs"][0][nQuality];
}

netease.prototype.generateFallbackUrl = function(dfsId) {
  console.log('Fallback to netease low quality.'.yellow)
  var s = (new Date()).getSeconds() % 2 + 1;
  var encId = this.getEncId(dfsId);
  var url = "http://m" + s + ".music.126.net/" + encId + "/" + dfsId + ".mp3";
  return url;
}

netease.prototype.modifyDetailApi = function(body) {
  console.log("Song Detail API Injected".green);

  return body
    .replace(/\"pl\":\d+/g, '"pl":320000')
    .replace(/\"dl\":\d+/g, '"dl":320000')
    .replace(/\"st\":-?\d+/g, '"st":0')
    .replace(/\"subp\":\d+/g, '"subp":1');
}

netease.prototype.modifyPlayerApiCustom = function(newUrl, hash, bitrate, filesize, body, index) {
  console.log("Player API Injected".green);

  var _this = this;

  var body = JSON.parse(body);
  
  console.log("New URL is ".green + newUrl.green);
  body["data"][index]["url"] = newUrl;
  body["data"][index]["br"] = bitrate;
  body["data"][index]["code"] = "200";
  body["data"][index]["size"] = filesize;
  body["data"][index]["md5"] = hash;
  body["data"][index]["type"] = "mp3";

  return JSON.stringify(body);
}

netease.prototype.modifyDownloadApiCustom = function(newUrl, hash, bitrate, filesize, body) {
  console.log("Download API Injected".green);

  var _this = this;

  var body = JSON.parse(body);

  console.log("New URL is ".green + newUrl.green);
  body["data"]["url"] = newUrl;
  body["data"]["br"] = bitrate;
  body["data"]["code"] = "200";
  body["data"]["size"] = filesize;
  body["data"]["md5"] = hash;
  body["data"]["type"] = "mp3";

  return JSON.stringify(body);
}

module.exports = netease;
