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

      _fs2.default.readdirSync(_path2.default.resolve(__dirname, 'plugins')).forEach(function (file) {
        var Plugin = require(_path2.default.resolve(__dirname, 'plugins', file));
        _this.plugins.push(new Plugin());
      });
      this.plugins.sort(function (a, b) {
        return a.order - b.order;
      });
      // console.log(this.plugins);
    }
  }, {
    key: 'batchSeachMusic',
    value: function batchSeachMusic(songName, artist, album) {
      var _this2 = this;

      return new _promise2.default(function (resolve, reject) {
        _async2.default.map(_this2.plugins, function () {
          var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(plugin, callback) {
            var keyword, searchResult, searchName, trueName;
            return _regenerator2.default.wrap(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    console.log(('Search from ' + plugin.name).green);
                    keyword = artist + ' ' + songName + ' ' + album;
                    searchResult = void 0;
                    _context.prev = 3;
                    _context.next = 6;
                    return plugin.search(keyword);

                  case 6:
                    searchResult = _context.sent;
                    _context.next = 13;
                    break;

                  case 9:
                    _context.prev = 9;
                    _context.t0 = _context['catch'](3);

                    console.log(('Cannot search from ' + plugin.name).red);
                    return _context.abrupt('return', callback(null));

                  case 13:
                    if (!(searchResult.length > 0)) {
                      _context.next = 18;
                      break;
                    }

                    // console.log(searchResult);
                    searchName = searchResult[0].name.replace(/ /g, '').toLowerCase();
                    trueName = songName.replace(/ /g, '').toLowerCase();

                    if (!(searchName.indexOf(trueName) !== -1)) {
                      _context.next = 18;
                      break;
                    }

                    return _context.abrupt('return', callback(null, {
                      plugin: plugin,
                      searchResult: searchResult[0]
                    }));

                  case 18:
                    console.log(('No resource found from ' + plugin.name).yellow);
                    return _context.abrupt('return', callback(null));

                  case 20:
                  case 'end':
                    return _context.stop();
                }
              }
            }, _callee, _this2, [[3, 9]]);
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
        var detail, songName, artist, album, result, plugin, data, songInfo, url;
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
                _context2.next = 11;
                break;

              case 7:
                _context2.prev = 7;
                _context2.t0 = _context2['catch'](1);

                console.log('Cannot get song info from netease.'.red);
                throw new Error(_context2.t0);

              case 11:
                songName = _netease2.default.getSongName(detail);
                artist = _netease2.default.getArtistName(detail);
                album = _netease2.default.getAlbumName(detail);

                console.log('Song name: '.green + songName);
                console.log('Artist: '.green + artist);
                console.log('Album: '.green + album);
                result = void 0;
                _context2.prev = 18;
                _context2.next = 21;
                return this.batchSeachMusic(songName, artist, album);

              case 21:
                result = _context2.sent;
                _context2.next = 28;
                break;

              case 24:
                _context2.prev = 24;
                _context2.t1 = _context2['catch'](18);

                console.log('Batch search failed.'.red);
                throw new Error(_context2.t1);

              case 28:
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
                  _context2.next = 48;
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
                _context2.prev = 34;
                _context2.next = 37;
                return plugin.getUrl(data);

              case 37:
                url = _context2.sent;
                _context2.next = 44;
                break;

              case 40:
                _context2.prev = 40;
                _context2.t2 = _context2['catch'](34);

                console.log('Cannot get song url'.red);
                throw new Error(_context2.t2);

              case 44:
                songInfo.origUrl = null;
                // 魔改 URL 应对某司防火墙
                if (_config2.default.rewriteUrl) {
                  songInfo.origUrl = url;
                  url = url.replace(plugin.baseUrl, 'm8.music.126.net/' + plugin.name.replace(/ /g, '').toLowerCase());
                }
                songInfo.url = url;
                return _context2.abrupt('return', songInfo);

              case 48:
                return _context2.abrupt('return', null);

              case 49:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this, [[1, 7], [18, 24], [34, 40]]);
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