'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

require('colors');

var _netease = require('./netease');

var _netease2 = _interopRequireDefault(_netease);

var _kugou = require('./kugou');

var _kugou2 = _interopRequireDefault(_kugou);

var _qq = require('./qq');

var _qq2 = _interopRequireDefault(_qq);

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

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
      var _this = this;

      return new _promise2.default(function () {
        var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(resolve, reject) {
          var detail, songName, artist, songInfo;
          return _regenerator2.default.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  _context.prev = 0;
                  _context.next = 3;
                  return _this.netease.getSongDetail(songId);

                case 3:
                  detail = _context.sent;
                  songName = _netease2.default.getSongName(detail);
                  artist = _netease2.default.getArtistName(detail);
                  songInfo = null;

                  if (!_this.qq) {
                    _context.next = 11;
                    break;
                  }

                  _context.next = 10;
                  return _this.qq.search(songName, artist);

                case 10:
                  songInfo = _context.sent;

                case 11:
                  if (!(!songInfo && _this.kugou)) {
                    _context.next = 19;
                    break;
                  }

                  _context.next = 14;
                  return _this.kugou.search(songName, artist);

                case 14:
                  songInfo = _context.sent;

                  if (!songInfo) {
                    _context.next = 19;
                    break;
                  }

                  _context.next = 18;
                  return _this.kugou.getUrl(songInfo.hash);

                case 18:
                  songInfo.url = _context.sent;

                case 19:
                  if (!songInfo) {
                    _context.next = 21;
                    break;
                  }

                  return _context.abrupt('return', resolve(songInfo));

                case 21:
                  return _context.abrupt('return', resolve(null));

                case 24:
                  _context.prev = 24;
                  _context.t0 = _context['catch'](0);

                  console.log(_context.t0);
                  return _context.abrupt('return', reject(_context.t0));

                case 28:
                case 'end':
                  return _context.stop();
              }
            }
          }, _callee, _this, [[0, 24]]);
        }));

        return function (_x, _x2) {
          return _ref.apply(this, arguments);
        };
      }());
    }
  }]);
  return Utils;
}();

exports.default = Utils;