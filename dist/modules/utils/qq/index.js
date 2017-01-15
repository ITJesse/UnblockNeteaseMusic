'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

require('colors');

var _common = require('../common');

var _common2 = _interopRequireDefault(_common);

var _config = require('../../config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var QQ = function () {
  function QQ() {
    (0, _classCallCheck3.default)(this, QQ);

    this.guid = null;
    this.vkey = null;
    this.updateTime = null;
  }

  (0, _createClass3.default)(QQ, [{
    key: 'getVKey',
    value: function () {
      var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee() {
        var self;
        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                self = this;

                if (!(!this.updateTime || this.updateTime + 3600 * 1000 < new Date().valueOf())) {
                  _context.next = 12;
                  break;
                }

                _context.prev = 2;
                _context.next = 5;
                return self.updateVKey();

              case 5:
                self.vkey = _context.sent;

                self.updateTime = new Date().valueOf();
                _context.next = 12;
                break;

              case 9:
                _context.prev = 9;
                _context.t0 = _context['catch'](2);

                console.log(_context.t0);

              case 12:
                return _context.abrupt('return', self.vkey);

              case 13:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this, [[2, 9]]);
      }));

      function getVKey() {
        return _ref.apply(this, arguments);
      }

      return getVKey;
    }()
  }, {
    key: 'updateVKey',
    value: function updateVKey() {
      var _this = this;

      this.guid = QQ.getGUid();
      var options = {
        url: 'http://base.music.qq.com/fcgi-bin/fcg_musicexpress.fcg?json=3&guid=' + this.guid
      };

      return new _promise2.default(function () {
        var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(resolve, reject) {
          var result, data;
          return _regenerator2.default.wrap(function _callee2$(_context2) {
            while (1) {
              switch (_context2.prev = _context2.next) {
                case 0:
                  _context2.prev = 0;
                  _context2.next = 3;
                  return _common2.default.sendRequest(options);

                case 3:
                  result = _context2.sent;

                  result.body = result.body.replace(/^jsonCallback\(/, '').replace(/\);$/, '');
                  data = JSON.parse(result.body);
                  return _context2.abrupt('return', resolve(data.key));

                case 9:
                  _context2.prev = 9;
                  _context2.t0 = _context2['catch'](0);

                  console.log(_context2.t0);
                  return _context2.abrupt('return', reject(_context2.t0));

                case 13:
                case 'end':
                  return _context2.stop();
              }
            }
          }, _callee2, _this, [[0, 9]]);
        }));

        return function (_x, _x2) {
          return _ref2.apply(this, arguments);
        };
      }());
    }
  }, {
    key: 'search',
    value: function () {
      var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4(name, artist) {
        var _this2 = this;

        var songName, options;
        return _regenerator2.default.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.prev = 0;
                _context4.next = 3;
                return this.getVKey();

              case 3:
                _context4.next = 8;
                break;

              case 5:
                _context4.prev = 5;
                _context4.t0 = _context4['catch'](0);
                return _context4.abrupt('return', console.log('QQ Music module initial failed.'.red));

              case 8:
                if (!(!this.vkey || this.vkey.length !== 112)) {
                  _context4.next = 10;
                  break;
                }

                return _context4.abrupt('return', console.log('QQ Music module is not ready.'.red));

              case 10:
                console.log('Search from QQ Music.'.green);
                console.log('Song name: '.green + name);
                console.log('Artist: '.green + artist);
                songName = encodeURIComponent(artist + ' ' + name);
                options = {
                  url: 'http://s.music.qq.com/fcgi-bin/music_search_new_platform?n=1&cr=1&loginUin=0&format=json&inCharset=utf-8&outCharset=utf-8&p=1&catZhida=0&w=' + songName
                };
                return _context4.abrupt('return', new _promise2.default(function () {
                  var _ref4 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(resolve, reject) {
                    var result, data, keyword, fsong, list, mid, bitrate, prefix, ext, url;
                    return _regenerator2.default.wrap(function _callee3$(_context3) {
                      while (1) {
                        switch (_context3.prev = _context3.next) {
                          case 0:
                            _context3.prev = 0;
                            _context3.next = 3;
                            return _common2.default.sendRequest(options);

                          case 3:
                            result = _context3.sent;
                            data = JSON.parse(result.body);
                            keyword = name.replace(/\s/g, '').toLowerCase();
                            fsong = data.data.song.list[0].fsong.replace(/\s/g, '').toLowerCase();

                            if (!(data.code === 0 && data.data.song.list.length > 0 && fsong.indexOf(keyword) !== -1)) {
                              _context3.next = 18;
                              break;
                            }

                            list = data.data.song.list[0].f.split('|');
                            mid = list[20];
                            bitrate = list[13];
                            prefix = void 0;
                            ext = void 0;

                            if (bitrate === '320000') {
                              prefix = 'M800';
                              ext = 'mp3';
                            } else if (bitrate === '128000') {
                              prefix = 'M500';
                              ext = 'mp3';
                            } else {
                              prefix = 'C200';
                              ext = 'm4a';
                            }
                            url = 'http://cc.stream.qqmusic.qq.com/' + prefix + mid + '.' + ext + '?vkey=' + _this2.vkey + '&guid=' + _this2.guid + '&fromtag=0';
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
                            return _context3.abrupt('return', resolve(result));

                          case 18:
                            console.log('No resource found from QQ Music'.yellow);
                            return _context3.abrupt('return', resolve(null));

                          case 22:
                            _context3.prev = 22;
                            _context3.t0 = _context3['catch'](0);

                            console.log(_context3.t0);
                            return _context3.abrupt('return', reject(_context3.t0));

                          case 26:
                          case 'end':
                            return _context3.stop();
                        }
                      }
                    }, _callee3, _this2, [[0, 22]]);
                  }));

                  return function (_x5, _x6) {
                    return _ref4.apply(this, arguments);
                  };
                }()));

              case 16:
              case 'end':
                return _context4.stop();
            }
          }
        }, _callee4, this, [[0, 5]]);
      }));

      function search(_x3, _x4) {
        return _ref3.apply(this, arguments);
      }

      return search;
    }()
  }], [{
    key: 'getGUid',
    value: function getGUid() {
      var currentMs = parseInt(new Date().valueOf() % 1000, 10);
      return parseInt(Math.round(Math.random() * 2147483647) * currentMs % 0x1E10, 10);
    }
  }]);
  return QQ;
}();

exports.default = QQ;