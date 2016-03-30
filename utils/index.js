var request = require('request');
var md5 = require('md5');
var base64 = require('base-64');
var PythonShell = require('python-shell');
var waterfall = require("async/waterfall");
var colors = require('colors');

var baseUrl = "http://223.252.199.7";

var utils = function() {
  this.body = '';
  this.headers = '';
}

utils.prototype.defaultPost = function(headers, body, url, callback) {
  var _this = this;
  _this.post(headers, body, url, function(err, headers, body) {
    if (err) {
      console.error(err);
      return callback(err);
    } else {
      _this.body = body;
      _this.headers = headers;
      delete _this.headers['content-encoding'];
      callback(null, headers, body);
    }
  })
}

utils.prototype.defaultGet = function(headers, url, callback) {
  var _this = this;
  _this.get(headers, url, function(err, headers, body) {
    if (err) {
      console.error(err);
      return callback(err);
    } else {
      _this.body = body;
      _this.headers = headers;
      delete _this.headers['content-encoding'];
      callback(null, headers, body);
    }
  })
}

utils.prototype.post = function(headers, body, url, callback) {
  // console.log(headers);
  var _this = this;

  body = new Buffer(body);

  if(!/^http/.test(url)) {
    url = baseUrl + url;
  }
  // console.log(url);
  var options = {
    url: url,
    headers: headers,
    method: 'post',
    body: body,
    gzip: true
  };
  request(options, function(err, res, body) {
    if (err) {
      console.error(err);
      return callback(err);
    } else {
      // console.log(res.headers);
      callback(null, res.headers, body);
    }
  });
}

utils.prototype.get = function(headers, url, callback) {
  // console.log(headers);
  var _this = this;

  if(!/^http/.test(url)) {
    url = baseUrl + url;
  }
  // console.log(url);
  var options = {
    url: url,
    headers: headers,
    method: 'get',
    gzip: true
  };
  request(options, function(err, res, body) {
    if (err) {
      console.error(err);
      return callback(err);
    } else {
      // console.log(res.headers);
      // console.log(body);
      callback(null, res.headers, body);
    }
  });
}

utils.prototype.getPlaybackBitrate = function() {
  // console.log(this.body);
  var body = JSON.parse(this.body);
  return body["data"][0]["br"];
}

utils.prototype.getPlaybackReturnCode = function() {
  var body = JSON.parse(this.body);
  return body["data"][0]["code"];
}

utils.prototype.getPlaybackUrl = function() {
  var body = JSON.parse(this.body);
  return body["data"][0]["url"];
}

utils.prototype.getEncId = function(dfsId, callback) {
  // var magicBytes = new Buffer('3go8&$8*3*3h0k(2)2');
  // var songId = new Buffer(dfsId.toString());
  // for (var i = 0; i < songId.length; i++) {
  //   songId[i] = songId[i] ^ magicBytes[i % magicBytes.length];
  // }
  // // console.log(songId);
  // var hash = md5(songId.toString());
  // return base64.encode(hash)
  //   .replace('/', '_')
  //   .replace('+', '-');

  var options = {
    mode: 'text',
    args: [dfsId]
  };

  PythonShell.run('./utils/get_enc_id.py', options, function(err, results) {
    if (err) {
      console.error(err.red);
      return callback(err);
    } else {
      callback(null, results[0]);
    }
    // results is an array consisting of messages collected during execution
    // console.log('results: %j', results);
  });
}

utils.prototype.generateUrl = function(dfsId, callback) {
  // console.log(dfsId);
  var s = (new Date()).getSeconds() % 2 + 1;
  this.getEncId(dfsId, function(err, encId) {
    if (err) {
      console.error(err.red);
      return callback(err);
    } else {
      var url = "http://m" + s + ".music.126.net/" + encId + "/" + dfsId + ".mp3";
      callback(null, url)
    }
  });
}

utils.prototype.getDfsId = function(pageContent) {
  var body = JSON.parse(pageContent);

  // Downgrade if we don't have higher quality...
  var nQuality = 'h';
  if (nQuality == "h" && !!!body["songs"][0]["h"]) {
    nQuality = "m";
  }
  if (nQuality == "m" && !!!body["songs"][0]["m"]) {
    nQuality = "l";
  }
  if (nQuality == "l" && !!!body["songs"][0]["l"]) {
    nQuality = "b";
  }

  if (nQuality == "b" && !!!body["songs"][0]["b"]) {
    console.log('Song url not found.'.red)
  }

  return body["songs"][0][nQuality]["fid"];
}

utils.prototype.getUrl = function(songId, callback) {
  var _this = this;

  waterfall([
    function(cb) {
      // Make post data
      var data = [{
        id: songId,
        v: 0
      }];
      data = "c=" + JSON.stringify(data);
      cb(null, data);
    },
    function(data, cb) {
      // Make post header
      var header = {
        'host': 'music.163.com',
        'cookie': 'os=pc',
        'content-length': data.length,
        'content-type': 'application/x-www-form-urlencoded'
      };
      cb(null, header, data);
    },
    function(header, data, cb) {
      // Do post and get dfsId
      _this.post(header, data, "/api/v2/song/detail", function(err, res, body) {
        if (err) {
          console.error(err.red);
          return cb(err);
        } else {
          var dfsId = _this.getDfsId(body);
          return cb(null, dfsId);
        }
      });
    },
    function(dfsId, cb) {
      // Generate url
      _this.generateUrl(dfsId, function(err, url) {
        if (err) {
          console.error(err.red);
          return cb(err);
        } else {
          cb(null, url);
        }
      })
    }
  ], function(err, url) {
    if (err) {
      console.error(err.red);
      return callback(err);
    } else {
      callback(null, url);
    }
  });
}

utils.prototype.modifyDetailApi = function() {
  console.log("Song Detail API Injected".green);

  this.body = this.body
    .replace(/\"pl\":\d+/g, '"pl":320000')
    .replace(/\"dl\":\d+/g, '"dl":320000')
    .replace(/\"st\":-?\d+/g, '"st":0')
    .replace(/\"subp\":\d+/g, '"subp":1');
  // console.log(this.body);
}

utils.prototype.modifyPlayerApi = function(callback) {
  console.log("Player API Injected".green);

  var _this = this;

  var body = JSON.parse(_this.body);
  var songId = body["data"][0]["id"];
  _this.getUrl(songId, function(err, newUrl) {
    if (err) {
      console.error(err.red);
      return callback(err);
    } else {
      var newUrl = newUrl;
      console.log("New URL is ".green + newUrl.green);
      body["data"][0]["url"] = newUrl;
      body["data"][0]["br"] = 320000;
      body["data"][0]["code"] = "200";

      _this.body = JSON.stringify(body);
      callback(null);
    }
  });
}

module.exports = utils;
