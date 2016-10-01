'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _colors = require('colors');

var _colors2 = _interopRequireDefault(_colors);

var _md = require('md5');

var _md2 = _interopRequireDefault(_md);

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

var _common = require('../common');

var _common2 = _interopRequireDefault(_common);

var _config = require('../../config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var qq = function qq() {};

var QQ = function () {
  function QQ() {
    (0, _classCallCheck3.default)(this, QQ);

    this.guid = this.getGUid();

    var self = this;
    this.getVKey().then(function (vkey) {
      self.vkey = vkey;
      console.log("QQ Music module is ready.".green);
    }).catch(function (err) {
      console.log(err);
    });
  }

  (0, _createClass3.default)(QQ, [{
    key: 'getGUid',
    value: function getGUid() {
      var currentMs = parseInt(new Date().valueOf() % 1000);
      return parseInt(Math.round(Math.random() * 2147483647) * currentMs % 0x1E10);
    }
  }, {
    key: 'getVKey',
    value: function getVKey() {
      var self = this;
      var options = {
        url: "http://base.music.qq.com/fcgi-bin/fcg_musicexpress.fcg?json=3&guid=" + self.guid
      };

      return new _promise2.default(function _callee(resolve, reject) {
        var result, data;
        return _regenerator2.default.async(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.prev = 0;
                _context.next = 3;
                return _regenerator2.default.awrap(_common2.default.sendRequest(options));

              case 3:
                result = _context.sent;

                result[1] = result[1].replace(/^jsonCallback\(/, '').replace(/\);$/, '');
                data = JSON.parse(result[1]);
                return _context.abrupt('return', resolve(data.key));

              case 9:
                _context.prev = 9;
                _context.t0 = _context['catch'](0);

                console.log(_context.t0);
                return _context.abrupt('return', reject(_context.t0));

              case 13:
                ;

              case 14:
              case 'end':
                return _context.stop();
            }
          }
        }, null, this, [[0, 9]]);
      });
    }
  }, {
    key: 'search',
    value: function search(name, artist) {
      var self = this;
      if (self.vkey.length != 112) {
        return console.log("QQ Music module is not ready.".red);
      }
      console.log("Search from QQ Music.".green);
      console.log("Song name: ".green + name);
      console.log("Artist: ".green + artist);
      var songName = encodeURIComponent(artist + " " + name);
      var options = {
        url: "http://s.music.qq.com/fcgi-bin/music_search_new_platform?n=1&cr=1&loginUin=0&format=json&inCharset=utf-8&outCharset=utf-8&p=1&catZhida=0&w=" + songName
      };

      return new _promise2.default(function _callee2(resolve, reject) {
        var result, data, keyword, fsong, list, mid, bitrate, prefix, ext, url;
        return _regenerator2.default.async(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.prev = 0;
                _context2.next = 3;
                return _regenerator2.default.awrap(_common2.default.sendRequest(options));

              case 3:
                result = _context2.sent;
                data = JSON.parse(result[1]);
                keyword = name.replace(/\s/g, '').toLowerCase();
                fsong = data.data.song.list[0].fsong.replace(/\s/g, '').toLowerCase();

                if (!(data.code === 0 && data.data.song.list.length > 0 && fsong.indexOf(keyword) != -1)) {
                  _context2.next = 19;
                  break;
                }

                list = data.data.song.list[0].f.split('|');
                mid = list[20];
                bitrate = list[13];
                prefix = void 0, ext = void 0;

                if (bitrate == '320000') {
                  prefix = 'M800';
                  ext = 'mp3';
                } else if (bitrate == '128000') {
                  prefix = 'M500';
                  ext = 'mp3';
                } else {
                  prefix = 'C200';
                  ext = 'm4a';
                }
                url = "http://cc.stream.qqmusic.qq.com/" + prefix + mid + "." + ext + "?vkey=" + self.vkey + "&guid=" + self.guid + "&fromtag=0";
                // 魔改 URL 应对某司防火墙

                if (_config2.default.rewriteUrl) {
                  url = url.replace('cc.stream.qqmusic.qq.com', 'music.163.com/qqmusic');
                }
                result = {
                  url: url,
                  bitrate: bitrate,
                  filesize: list[11],
                  hash: ''
                };
                return _context2.abrupt('return', resolve(result));

              case 19:
                console.log("No resource found from QQ Music".yellow);
                return _context2.abrupt('return', resolve(null));

              case 21:
                _context2.next = 27;
                break;

              case 23:
                _context2.prev = 23;
                _context2.t0 = _context2['catch'](0);

                console.log(_context2.t0);
                return _context2.abrupt('return', reject(_context2.t0));

              case 27:
                ;

              case 28:
              case 'end':
                return _context2.stop();
            }
          }
        }, null, this, [[0, 23]]);
      });
    }
  }]);
  return QQ;
}();

exports.default = QQ;