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

var _md = require('md5');

var _md2 = _interopRequireDefault(_md);

var _common = require('../common');

var _common2 = _interopRequireDefault(_common);

var _config = require('../../config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var kugou = function kugou() {
  var _this = this;

  (0, _classCallCheck3.default)(this, kugou);

  this.search = function (name, artist) {
    console.log('Search from Kugou.'.green);
    console.log('Song name:'.green + name);
    console.log('Artist: '.green + artist);
    var songName = encodeURIComponent(artist + ' ' + name);
    var options = {
      url: 'http://mobilecdn.kugou.com/api/v3/search/song?format=json&keyword=' + songName + '&page=1&pagesize=1&showtype=1'
    };

    return new _promise2.default(function () {
      var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(resolve, reject) {
        var data, result, hash320;
        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                data = void 0;
                result = void 0;
                _context.prev = 2;
                _context.next = 5;
                return _common2.default.sendRequest(options);

              case 5:
                result = _context.sent;

                data = JSON.parse(result.body);
                _context.next = 13;
                break;

              case 9:
                _context.prev = 9;
                _context.t0 = _context['catch'](2);

                console.log(_context.t0);
                return _context.abrupt('return', reject(_context.t0));

              case 13:
                if (!(data.status === 1 && !!data.data.info.length && !!data.data.info[0]['320hash'].length && data.data.info[0].songname.indexOf(name) !== -1)) {
                  _context.next = 17;
                  break;
                }

                hash320 = data.data.info[0]['320hash'];

                result = {
                  hash: hash320,
                  bitrate: 320000,
                  filesize: data.data.info[0]['320filesize']
                };
                return _context.abrupt('return', resolve(result));

              case 17:
                console.error('No resource found on kugou.'.yellow);
                return _context.abrupt('return', resolve(null));

              case 19:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, _this, [[2, 9]]);
      }));

      return function (_x, _x2) {
        return _ref.apply(this, arguments);
      };
    }());
  };

  this.getUrl = function (hash) {
    var key = (0, _md2.default)(hash + 'kgcloud');
    var options = {
      url: 'http://trackercdn.kugou.com/i/?acceptMp3=1&cmd=4&pid=6&hash=' + hash + '&key=' + key
    };

    return new _promise2.default(function () {
      var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(resolve, reject) {
        var data, result, url;
        return _regenerator2.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                data = void 0;
                _context2.prev = 1;
                _context2.next = 4;
                return _common2.default.sendRequest(options);

              case 4:
                result = _context2.sent;

                data = JSON.parse(result.body);
                _context2.next = 12;
                break;

              case 8:
                _context2.prev = 8;
                _context2.t0 = _context2['catch'](1);

                console.log(_context2.t0);
                return _context2.abrupt('return', reject(_context2.t0));

              case 12:
                if (!data.error) {
                  _context2.next = 15;
                  break;
                }

                console.error(data.error);
                return _context2.abrupt('return', reject(data.error));

              case 15:
                url = void 0;

                if (!(data.status === 1)) {
                  _context2.next = 20;
                  break;
                }

                url = data.url;
                _context2.next = 22;
                break;

              case 20:
                console.error('No resource found on kugou.'.yellow);
                return _context2.abrupt('return', resolve(null));

              case 22:

                // 魔改 URL 应对某司防火墙
                if (_config2.default.rewriteUrl) {
                  url = url.replace('fs.web.kugou.com', 'music.163.com/kugou');
                }

                return _context2.abrupt('return', resolve(url));

              case 24:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, _this, [[1, 8]]);
      }));

      return function (_x3, _x4) {
        return _ref2.apply(this, arguments);
      };
    }());
  };
};

exports.default = kugou;