'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

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

var _requestPromise = require('request-promise');

var _requestPromise2 = _interopRequireDefault(_requestPromise);

var _crypto = require('crypto');

var _crypto2 = _interopRequireDefault(_crypto);

var _remoteFileSize = require('remote-file-size');

var _remoteFileSize2 = _interopRequireDefault(_remoteFileSize);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Netease = function () {
  function Netease(ip) {
    (0, _classCallCheck3.default)(this, Netease);

    this.baseUrl = 'http://' + ip;
  }

  (0, _createClass3.default)(Netease, [{
    key: 'getSongDetail',
    value: function () {
      var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(songId) {
        var header, options, result;
        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                header = {
                  host: 'music.163.com',
                  'content-type': 'application/x-www-form-urlencoded'
                };
                options = {
                  url: this.baseUrl + '/api/song/detail/?ids=[' + songId + ']&id=' + songId,
                  headers: header,
                  method: 'get',
                  gzip: true
                };
                result = void 0;
                _context.prev = 3;
                _context.next = 6;
                return (0, _requestPromise2.default)(options);

              case 6:
                result = _context.sent;
                _context.next = 12;
                break;

              case 9:
                _context.prev = 9;
                _context.t0 = _context['catch'](3);
                throw new Error(_context.t0);

              case 12:
                return _context.abrupt('return', result);

              case 13:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this, [[3, 9]]);
      }));

      function getSongDetail(_x) {
        return _ref.apply(this, arguments);
      }

      return getSongDetail;
    }()
  }], [{
    key: 'getDownloadReturnCode',
    value: function getDownloadReturnCode(body) {
      return body.data.code;
    }
  }, {
    key: 'getDownloadUrl',
    value: function getDownloadUrl(body) {
      return body.data.url;
    }
  }, {
    key: 'getSongName',
    value: function getSongName(body) {
      body = JSON.parse(body);
      return body.songs[0].name;
    }
  }, {
    key: 'getArtistName',
    value: function getArtistName(body) {
      body = JSON.parse(body);
      return body.songs[0].artists[0].name;
    }
  }, {
    key: 'getAlbumName',
    value: function getAlbumName(body) {
      body = JSON.parse(body);
      return body.songs[0].album.name;
    }
  }, {
    key: 'getDownloadSongId',
    value: function getDownloadSongId(body) {
      return body.data.id;
    }
  }, {
    key: 'getFilesize',
    value: function getFilesize(url) {
      console.log('Getting filesize.'.yellow);
      return new _promise2.default(function (resolve, reject) {
        (0, _remoteFileSize2.default)(url, function (err, size) {
          if (err) return reject(err);
          console.log('Filesize:'.green, size);
          return resolve(size);
        });
      });
    }
  }, {
    key: 'modifyPlayerApiCustom',
    value: function () {
      var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(urlInfo, body) {
        return _regenerator2.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                console.log('Player API Injected'.green);
                console.log('New URL is '.green + urlInfo.url);
                body.url = urlInfo.url;
                body.br = urlInfo.bitrate;
                body.code = 200;
                body.md5 = urlInfo.hash;
                body.type = urlInfo.type;

                if (urlInfo.filesize) {
                  _context2.next = 19;
                  break;
                }

                _context2.prev = 8;
                _context2.next = 11;
                return Netease.getFilesize(urlInfo.origUrl || urlInfo.url);

              case 11:
                body.filesize = _context2.sent;
                _context2.next = 17;
                break;

              case 14:
                _context2.prev = 14;
                _context2.t0 = _context2['catch'](8);
                throw new Error(_context2.t0);

              case 17:
                _context2.next = 20;
                break;

              case 19:
                body.filesize = urlInfo.filesize;

              case 20:
                return _context2.abrupt('return', body);

              case 21:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this, [[8, 14]]);
      }));

      function modifyPlayerApiCustom(_x2, _x3) {
        return _ref2.apply(this, arguments);
      }

      return modifyPlayerApiCustom;
    }()
  }, {
    key: 'modifyDownloadApiCustom',
    value: function () {
      var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(urlInfo, body) {
        return _regenerator2.default.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                console.log('Download API Injected'.green);
                console.log('New URL is '.green + urlInfo.url);
                body.data.url = urlInfo.url;
                body.data.br = urlInfo.bitrate;
                body.data.code = 200;
                body.data.md5 = urlInfo.hash;
                body.data.type = 'mp3';

                if (urlInfo.filesize) {
                  _context3.next = 19;
                  break;
                }

                _context3.prev = 8;
                _context3.next = 11;
                return Netease.getFilesize(urlInfo.origUrl || urlInfo.url);

              case 11:
                body.filesize = _context3.sent;
                _context3.next = 17;
                break;

              case 14:
                _context3.prev = 14;
                _context3.t0 = _context3['catch'](8);
                throw new Error(_context3.t0);

              case 17:
                _context3.next = 20;
                break;

              case 19:
                body.filesize = urlInfo.filesize;

              case 20:
                return _context3.abrupt('return', (0, _stringify2.default)(body));

              case 21:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this, [[8, 14]]);
      }));

      function modifyDownloadApiCustom(_x4, _x5) {
        return _ref3.apply(this, arguments);
      }

      return modifyDownloadApiCustom;
    }()
  }, {
    key: 'decryptLinuxForwardApi',
    value: function decryptLinuxForwardApi(eparams) {
      var key = new Buffer('7246674226682325323F5E6544673A51', 'hex');
      var decipher = _crypto2.default.createDecipheriv('aes-128-ecb', key, '');
      decipher.setAutoPadding(true);
      var cipherChunks = [];
      cipherChunks.push(decipher.update(eparams, 'hex'));
      cipherChunks.push(decipher.final());

      var totalLength = 0;
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = (0, _getIterator3.default)(cipherChunks), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var e = _step.value;

          totalLength += e.length;
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      return Buffer.concat(cipherChunks, totalLength);
    }
  }]);
  return Netease;
}();

exports.default = Netease;