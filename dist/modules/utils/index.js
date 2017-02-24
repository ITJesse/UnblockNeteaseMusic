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

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _async = require('async');

var _async2 = _interopRequireDefault(_async);

var _netease = require('./netease');

var _netease2 = _interopRequireDefault(_netease);

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Utils = function () {
  function Utils() {
    (0, _classCallCheck3.default)(this, Utils);

    var ip = _config2.default.forceIp ? _config2.default.forceIp : '223.252.199.7';
    this.netease = new _netease2.default(ip);
    this.plugins = [];
    this.initPlugins();
  }

  (0, _createClass3.default)(Utils, [{
    key: 'initPlugins',
    value: function initPlugins() {
      var _this = this;

      _fs2.default.readdirSync(_path2.default.resolve(__dirname, 'plugins')).forEach(function (e) {
        var Plugin = require(_path2.default.resolve(__dirname, 'plugins', e));
        _this.plugins.push(new Plugin());
      });
      this.plugins.sort(function (a, b) {
        return a.order - b.order;
      });
      // console.log(this.plugins);
    }
  }, {
    key: 'batchSeachMusic',
    value: function batchSeachMusic(songName, artist) {
      var _this2 = this;

      return new _promise2.default(function (resolve, reject) {
        _async2.default.map(_this2.plugins, function () {
          var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(plugin, callback) {
            var searchResult, searchName, trueName;
            return _regenerator2.default.wrap(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    console.log(('Search from ' + plugin.name).green);
                    _context.next = 3;
                    return plugin.search(songName, artist);

                  case 3:
                    searchResult = _context.sent;
                    searchName = searchResult[0].name.trim().toLowerCase();
                    trueName = songName.trim().toLowerCase();

                    if (searchResult.length > 0 && searchName.indexOf(trueName) !== -1) {
                      callback(null, {
                        plugin: plugin,
                        searchResult: searchResult[0]
                      });
                    } else {
                      console.log(('No resource found from ' + plugin.name).yellow);
                      callback(null);
                    }

                  case 7:
                  case 'end':
                    return _context.stop();
                }
              }
            }, _callee, _this2);
          }));

          return function (_x, _x2) {
            return _ref.apply(this, arguments);
          };
        }(), function (err, result) {
          if (err) return reject(err);
          return resolve(result);
        });
      });
    }

    /*
      Get song url.
    */

  }, {
    key: 'getUrlInfo',
    value: function () {
      var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(songId) {
        var detail, songName, artist, result, plugin, data, songInfo, url;
        return _regenerator2.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                detail = void 0;
                _context2.prev = 1;
                _context2.next = 4;
                return this.netease.getSongDetail(songId);

              case 4:
                detail = _context2.sent;
                _context2.next = 10;
                break;

              case 7:
                _context2.prev = 7;
                _context2.t0 = _context2['catch'](1);
                throw new Error(_context2.t0);

              case 10:
                songName = _netease2.default.getSongName(detail);
                artist = _netease2.default.getArtistName(detail);

                console.log('Song name: '.green + songName);
                console.log('Artist: '.green + artist);
                result = void 0;
                _context2.prev = 15;
                _context2.next = 18;
                return this.batchSeachMusic(songName, artist);

              case 18:
                result = _context2.sent;
                _context2.next = 24;
                break;

              case 21:
                _context2.prev = 21;
                _context2.t1 = _context2['catch'](15);
                throw new Error(_context2.t1);

              case 24:
                result = result.sort(function (a, b) {
                  if (!a) {
                    return 1;
                  }
                  if (!b) {
                    return -1;
                  }
                  if (parseInt(a.searchResult.bitrate, 10) > parseInt(b.searchResult.bitrate, 10)) {
                    return -1;
                  }
                  if (parseInt(a.searchResult.bitrate, 10) < parseInt(b.searchResult.bitrate, 10)) {
                    return 1;
                  }
                  if (a.searchResult.bitrate === b.searchResult.bitrate) {
                    return a.searchResult.order - b.searchResult.order;
                  }
                  return 0;
                });

                if (!result[0]) {
                  _context2.next = 42;
                  break;
                }

                plugin = result[0].plugin;
                data = result[0].searchResult;
                songInfo = {
                  bitrate: data.bitrate,
                  filesize: data.filesize,
                  hash: data.hash,
                  type: data.type
                };
                url = void 0;
                _context2.prev = 30;
                _context2.next = 33;
                return plugin.getUrl(data);

              case 33:
                url = _context2.sent;
                _context2.next = 39;
                break;

              case 36:
                _context2.prev = 36;
                _context2.t2 = _context2['catch'](30);
                throw new Error(_context2.t2);

              case 39:
                // 魔改 URL 应对某司防火墙
                if (_config2.default.rewriteUrl) {
                  url = url.replace(plugin.baseUrl, 'music.163.com/' + plugin.name.trim().toLowerCase());
                }
                songInfo.url = url;
                return _context2.abrupt('return', songInfo);

              case 42:
                return _context2.abrupt('return', null);

              case 43:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this, [[1, 7], [15, 21], [30, 36]]);
      }));

      function getUrlInfo(_x3) {
        return _ref2.apply(this, arguments);
      }

      return getUrlInfo;
    }()
  }]);
  return Utils;
}();

exports.default = Utils;