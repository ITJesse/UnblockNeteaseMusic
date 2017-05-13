'use strict';

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

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

var common = _interopRequireWildcard(_common);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var QQ = function () {
  function QQ() {
    (0, _classCallCheck3.default)(this, QQ);

    this.name = 'QQ Music';
    this.order = 1;
    this.baseUrl = 'dl.stream.qqmusic.qq.com';
    this.guid = null;
    this.vkey = null;
    this.updateTime = null;
  }

  (0, _createClass3.default)(QQ, [{
    key: 'getVKey',
    value: function () {
      var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee() {
        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (!(!this.updateTime || this.updateTime + 3600 * 1000 < new Date().valueOf())) {
                  _context.next = 12;
                  break;
                }

                _context.prev = 1;
                _context.next = 4;
                return this.updateVKey();

              case 4:
                this.vkey = _context.sent;

                this.updateTime = new Date().valueOf();
                _context.next = 12;
                break;

              case 8:
                _context.prev = 8;
                _context.t0 = _context['catch'](1);

                console.log('Cannot update vkey.'.red);
                console.log(_context.t0);

              case 12:
                return _context.abrupt('return', this.vkey);

              case 13:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this, [[1, 8]]);
      }));

      function getVKey() {
        return _ref.apply(this, arguments);
      }

      return getVKey;
    }()
  }, {
    key: 'updateVKey',
    value: function () {
      var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2() {
        var options, result, data;
        return _regenerator2.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                this.guid = QQ.getGUid();
                options = {
                  url: 'https://c.y.qq.com/base/fcgi-bin/fcg_musicexpress.fcg?json=3&guid=' + this.guid + '&g_tk=5381&jsonpCallback=jsonCallback&loginUin=0&hostUin=0&format=json&inCharset=utf8&outCharset=utf8&notice=0&platform=yqq&needNewCode=0'
                };
                _context2.prev = 2;
                _context2.next = 5;
                return common.sendRequest(options);

              case 5:
                result = _context2.sent;
                data = JSON.parse(result.body);
                return _context2.abrupt('return', data.key);

              case 10:
                _context2.prev = 10;
                _context2.t0 = _context2['catch'](2);
                throw new Error(_context2.t0);

              case 13:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this, [[2, 10]]);
      }));

      function updateVKey() {
        return _ref2.apply(this, arguments);
      }

      return updateVKey;
    }()
  }, {
    key: 'search',
    value: function () {
      var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(keyword) {
        var options, data, _result, result, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, e, list, prefix, bitrate, filesize, type;

        return _regenerator2.default.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.prev = 0;
                _context3.next = 3;
                return this.getVKey();

              case 3:
                _context3.next = 8;
                break;

              case 5:
                _context3.prev = 5;
                _context3.t0 = _context3['catch'](0);
                return _context3.abrupt('return', console.log('QQ Music module initial failed.'.red));

              case 8:
                if (!(!this.vkey || this.vkey.length !== 112)) {
                  _context3.next = 10;
                  break;
                }

                return _context3.abrupt('return', console.log('QQ Music module is not ready.'.red));

              case 10:
                options = {
                  url: 'https://c.y.qq.com/soso/fcgi-bin/client_search_cp?ct=24&qqmusic_ver=1298&new_json=1&remoteplace=txt.yqq.song&t=0&aggr=1&cr=1&catZhida=1&lossless=1&flag_qc=0&p=1&n=1&w=' + encodeURIComponent(keyword) + '&g_tk=5381&loginUin=0&hostUin=0&format=json&inCharset=utf8&outCharset=utf-8&notice=0&platform=yqq&needNewCode=0'
                };
                data = void 0;
                _context3.prev = 12;
                _context3.next = 15;
                return common.sendRequest(options);

              case 15:
                _result = _context3.sent;

                data = JSON.parse(_result.body);
                _context3.next = 22;
                break;

              case 19:
                _context3.prev = 19;
                _context3.t1 = _context3['catch'](12);
                throw new Error(_context3.t1);

              case 22:
                result = [];

                if (!(data.code === 0 && data.data.song.list.length > 0)) {
                  _context3.next = 43;
                  break;
                }

                _iteratorNormalCompletion = true;
                _didIteratorError = false;
                _iteratorError = undefined;
                _context3.prev = 27;

                for (_iterator = (0, _getIterator3.default)(data.data.song.list); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                  e = _step.value;
                  list = e.file;
                  prefix = void 0;
                  bitrate = void 0;
                  filesize = void 0;
                  type = void 0;

                  if (list.size_128 && list.size_128 > 0) {
                    prefix = 'M500';
                    type = 'mp3';
                    bitrate = 128000;
                    filesize = list.size_128;
                  }
                  if (list.size_320 && list.size_320 > 0) {
                    prefix = 'M800';
                    type = 'mp3';
                    bitrate = 320000;
                    filesize = list.size_320;
                  }
                  // if (list.size_flac && list.size_flac > 0) {
                  //   prefix = 'F000';
                  //   type = 'flac';
                  //   bitrate = 999000;
                  //   filesize = list.size_flac;
                  // }
                  result.push({
                    name: e.name || 'V.A.',
                    artist: e.singer.name || 'V.A.',
                    filesize: filesize,
                    hash: '',
                    mid: list.media_mid,
                    bitrate: String(bitrate),
                    prefix: prefix,
                    type: type
                  });
                }
                _context3.next = 35;
                break;

              case 31:
                _context3.prev = 31;
                _context3.t2 = _context3['catch'](27);
                _didIteratorError = true;
                _iteratorError = _context3.t2;

              case 35:
                _context3.prev = 35;
                _context3.prev = 36;

                if (!_iteratorNormalCompletion && _iterator.return) {
                  _iterator.return();
                }

              case 38:
                _context3.prev = 38;

                if (!_didIteratorError) {
                  _context3.next = 41;
                  break;
                }

                throw _iteratorError;

              case 41:
                return _context3.finish(38);

              case 42:
                return _context3.finish(35);

              case 43:
                return _context3.abrupt('return', result);

              case 44:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this, [[0, 5], [12, 19], [27, 31, 35, 43], [36,, 38, 42]]);
      }));

      function search(_x) {
        return _ref3.apply(this, arguments);
      }

      return search;
    }()
  }, {
    key: 'getUrl',
    value: function () {
      var _ref4 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4(data) {
        var url;
        return _regenerator2.default.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                url = 'http://dl.stream.qqmusic.qq.com/' + data.prefix + data.mid + '.' + data.type + '?vkey=' + this.vkey + '&guid=' + this.guid + '&uin=0&fromtag=30';
                return _context4.abrupt('return', url);

              case 2:
              case 'end':
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function getUrl(_x2) {
        return _ref4.apply(this, arguments);
      }

      return getUrl;
    }()
  }], [{
    key: 'getGUid',
    value: function getGUid() {
      var currentMs = new Date().getUTCMilliseconds();
      return Math.round(2147483647 * Math.random()) * currentMs % 1e10;
    }
  }]);
  return QQ;
}();

module.exports = QQ;