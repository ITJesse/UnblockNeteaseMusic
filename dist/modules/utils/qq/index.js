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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var qq = function qq() {};

var QQ = function () {
  function QQ() {
    (0, _classCallCheck3.default)(this, QQ);
  }

  (0, _createClass3.default)(QQ, [{
    key: 'search',
    value: function search(name, artist) {
      console.log("Search from QQ Music.".green);
      console.log("Song name: ".green + name);
      console.log("Artist: ".green + artist);
      var songName = encodeURIComponent(artist + " " + name);
      var options = {
        url: "http://s.music.qq.com/fcgi-bin/music_search_new_platform?n=1&cr=1&loginUin=0&format=json&inCharset=utf-8&outCharset=utf-8&p=1&catZhida=0&w=" + songName
      };

      return new _promise2.default(function _callee(resolve, reject) {
        var result, data, keyword, fsong, list;
        return _regenerator2.default.async(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.prev = 0;
                _context.next = 3;
                return _regenerator2.default.awrap(_common2.default.sendRequest(options));

              case 3:
                result = _context.sent;
                data = JSON.parse(result[1]);
                keyword = name.replace(/\s/g, '').toLowerCase();
                fsong = data.data.song.list[0].fsong.replace(/\s/g, '').toLowerCase();

                if (!(data.code === 0 && data.data.song.list.length > 0 && fsong.indexOf(keyword) != -1)) {
                  _context.next = 13;
                  break;
                }

                list = data.data.song.list[0].f.split('|');

                result = {
                  url: 'http://music.163.com/qqmusic/' + list[0] + '.mp3',
                  bitrate: list[13],
                  filesize: list[11],
                  hash: (0, _md2.default)(list[0])
                };
                return _context.abrupt('return', resolve(result));

              case 13:
                console.log("No resource found from QQ Music".yellow);
                return _context.abrupt('return', resolve(null));

              case 15:
                _context.next = 21;
                break;

              case 17:
                _context.prev = 17;
                _context.t0 = _context['catch'](0);

                console.log(_context.t0);
                reject(_context.t0);

              case 21:
                ;

              case 22:
              case 'end':
                return _context.stop();
            }
          }
        }, null, this, [[0, 17]]);
      });
    }
  }]);
  return QQ;
}();

exports.default = QQ;
//# sourceMappingURL=index.js.map