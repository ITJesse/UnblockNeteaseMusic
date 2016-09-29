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

var kugou = function () {
  function kugou() {
    (0, _classCallCheck3.default)(this, kugou);
  }

  (0, _createClass3.default)(kugou, [{
    key: 'search',
    value: function search(name, artist) {
      console.log("Search from Kugou.".green);
      console.log("Song name: ".green + name);
      console.log("Artist: ".green + artist);
      var songName = encodeURIComponent(artist + " " + name);
      var options = {
        url: "http://mobilecdn.kugou.com/api/v3/search/song?format=json&keyword=" + songName + "&page=1&pagesize=1&showtype=1"
      };

      return new _promise2.default(function _callee(resolve, reject) {
        var _result, data, hash320;

        return _regenerator2.default.async(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.prev = 0;
                _context.next = 3;
                return _regenerator2.default.awrap(_common2.default.sendRequest(options));

              case 3:
                _result = _context.sent;
                _context.next = 10;
                break;

              case 6:
                _context.prev = 6;
                _context.t0 = _context['catch'](0);

                console.log(_context.t0);
                return _context.abrupt('return', reject(_context.t0));

              case 10:
                data = JSON.parse(result[1]);

                if (!(data.status == 1 && !!data['data']['info'].length && !!data['data']['info'][0]['320hash'].length && data['data']['info'][0]['songname'].indexOf(name) != -1)) {
                  _context.next = 17;
                  break;
                }

                hash320 = data['data']['info'][0]['320hash'];

                result = {
                  hash: hash320,
                  bitrate: 320000,
                  filesize: data['data']['info'][0]['320filesize']
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
        }, null, this, [[0, 6]]);
      });
    }
  }, {
    key: 'getUrl',
    value: function getUrl(hash) {
      var key = (0, _md2.default)(hash + 'kgcloud');
      var options = {
        url: "http://trackercdn.kugou.com/i/?acceptMp3=1&cmd=4&pid=6&hash=" + hash + "&key=" + key
      };

      return new _promise2.default(function _callee2(resolve, reject) {
        var _result2, data, url;

        return _regenerator2.default.async(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.prev = 0;
                _context2.next = 3;
                return _regenerator2.default.awrap(_common2.default.sendRequest(options));

              case 3:
                _result2 = _context2.sent;
                _context2.next = 10;
                break;

              case 6:
                _context2.prev = 6;
                _context2.t0 = _context2['catch'](0);

                console.log(_context2.t0);
                return _context2.abrupt('return', reject(_context2.t0));

              case 10:
                data = JSON.parse(result[1]);

                if (!(data.status == 1)) {
                  _context2.next = 17;
                  break;
                }

                url = data['url'];

                // 魔改 URL 应对某司防火墙

                if (_config2.default.rewriteUrl) {
                  url = url.replace('fs.web.kugou.com', 'music.163.com/kugou');
                }

                return _context2.abrupt('return', resolve(url));

              case 17:
                console.error(data['error']);
                return _context2.abrupt('return', reject(data['error']));

              case 19:
              case 'end':
                return _context2.stop();
            }
          }
        }, null, this, [[0, 6]]);
      });
    }
  }]);
  return kugou;
}();

exports.default = kugou;
//# sourceMappingURL=index.js.map