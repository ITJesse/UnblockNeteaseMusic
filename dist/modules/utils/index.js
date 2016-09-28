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

var _co = require('co');

var _co2 = _interopRequireDefault(_co);

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

var _netease = require('./netease');

var _netease2 = _interopRequireDefault(_netease);

var _kugou = require('./kugou');

var _kugou2 = _interopRequireDefault(_kugou);

var _qq = require('./qq');

var _qq2 = _interopRequireDefault(_qq);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Utils = function () {
  function Utils() {
    (0, _classCallCheck3.default)(this, Utils);

    var ip = _config2.default.forceIp ? _config2.default.forceIp : '223.252.199.7';

    this.netease = new _netease2.default(ip);
    this.kugou = null;
    this.dongting = null;

    if (_config2.default.kugou) {
      this.kugou = new _kugou2.default();
    }
    if (_config2.default.dongting) {
      this.dongting = new dongting();
    }
    if (_config2.default.qq) {
      this.qq = new _qq2.default();
    }
  }

  /*
    Get song url.
  */


  (0, _createClass3.default)(Utils, [{
    key: 'getUrlInfo',
    value: function getUrlInfo(songId) {
      var self = this;

      return new _promise2.default(function _callee(resolve, reject) {
        var detail, songName, artist, songInfo;
        return _regenerator2.default.async(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.prev = 0;
                _context.next = 3;
                return _regenerator2.default.awrap(self.netease.getSongDetail(songId));

              case 3:
                detail = _context.sent;
                songName = self.netease.getSongName(detail);
                artist = self.netease.getArtistName(detail);
                songInfo = null;

                if (!self.qq) {
                  _context.next = 11;
                  break;
                }

                _context.next = 10;
                return _regenerator2.default.awrap(self.qq.search(songName, artist));

              case 10:
                songInfo = _context.sent;

              case 11:
                if (!(!songInfo && self.kugou)) {
                  _context.next = 19;
                  break;
                }

                _context.next = 14;
                return _regenerator2.default.awrap(self.kugou.search(songName, artist));

              case 14:
                songInfo = _context.sent;

                if (!songInfo) {
                  _context.next = 19;
                  break;
                }

                _context.next = 18;
                return _regenerator2.default.awrap(self.kugou.getUrl(songInfo.hash));

              case 18:
                songInfo.url = _context.sent;

              case 19:
                if (!songInfo) {
                  _context.next = 23;
                  break;
                }

                return _context.abrupt('return', resolve(songInfo));

              case 23:
                return _context.abrupt('return', resolve(null));

              case 24:
                _context.next = 30;
                break;

              case 26:
                _context.prev = 26;
                _context.t0 = _context['catch'](0);

                console.log(_context.t0);
                return _context.abrupt('return', reject(_context.t0));

              case 30:
              case 'end':
                return _context.stop();
            }
          }
        }, null, this, [[0, 26]]);
      });
    }
  }]);
  return Utils;
}();

exports.default = Utils;
//# sourceMappingURL=index.js.map