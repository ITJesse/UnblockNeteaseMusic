'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _colors = require('colors');

var _colors2 = _interopRequireDefault(_colors);

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

var _crypto = require('crypto');

var _crypto2 = _interopRequireDefault(_crypto);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var netease = function () {
  function netease(ip) {
    (0, _classCallCheck3.default)(this, netease);

    this.baseUrl = "http://" + ip;
  }

  (0, _createClass3.default)(netease, [{
    key: 'getDownloadReturnCode',
    value: function getDownloadReturnCode(body) {
      body = JSON.parse(body);
      return body["data"]["code"];
    }
  }, {
    key: 'getDownloadUrl',
    value: function getDownloadUrl(body) {
      body = JSON.parse(body);
      return body["data"]["url"];
    }
  }, {
    key: 'getSongName',
    value: function getSongName(body) {
      body = JSON.parse(body);
      return body["songs"][0]['name'];
    }
  }, {
    key: 'getArtistName',
    value: function getArtistName(body) {
      body = JSON.parse(body);
      return body["songs"][0]['artists'][0]['name'];
    }
  }, {
    key: 'getDownloadSongId',
    value: function getDownloadSongId(body) {
      body = JSON.parse(body);
      return body["data"]["id"];
    }
  }, {
    key: 'getSongDetail',
    value: function getSongDetail(songId) {
      var self = this;

      var data = [{
        id: songId,
        v: 0
      }];

      var header = {
        'host': 'music.163.com',
        'content-type': 'application/x-www-form-urlencoded'
      };

      var options = {
        url: self.baseUrl + "/api/song/detail/?ids=[" + songId + "]&id=" + songId,
        headers: header,
        method: 'get',
        gzip: true
      };
      return new _promise2.default(function (resolve, reject) {
        (0, _request2.default)(options, function (err, res, body) {
          if (err) {
            console.error(err.red);
            reject(err);
          } else {
            resolve(body);
          }
        });
      });
    }
  }, {
    key: 'modifyPlayerApiCustom',
    value: function modifyPlayerApiCustom(urlInfo, body) {
      console.log("Player API Injected".green);

      var self = this;

      console.log("New URL is ".green + urlInfo.url);
      body["url"] = urlInfo.url;
      body["br"] = urlInfo.bitrate;
      body["code"] = "200";
      body["size"] = urlInfo.filesize;
      body["md5"] = urlInfo.hash;
      body["type"] = "mp3";

      return body;
    }
  }, {
    key: 'modifyDownloadApiCustom',
    value: function modifyDownloadApiCustom(urlInfo, body) {
      console.log("Download API Injected".green);

      var self = this;

      body = JSON.parse(body);

      console.log("New URL is ".green + urlInfo.url);
      body["data"]["url"] = urlInfo.url;
      body["data"]["br"] = urlInfo.bitrate;
      body["data"]["code"] = "200";
      body["data"]["size"] = urlInfo.filesize;
      body["data"]["md5"] = urlInfo.hash;
      body["data"]["type"] = "mp3";

      return (0, _stringify2.default)(body);
    }
  }]);
  return netease;
}();

exports.default = netease;
//# sourceMappingURL=index.js.map