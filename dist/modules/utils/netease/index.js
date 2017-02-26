'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var netease = function () {
  function netease(ip) {
    (0, _classCallCheck3.default)(this, netease);

    this.baseUrl = 'http://' + ip;
  }

  (0, _createClass3.default)(netease, [{
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
    key: 'getDownloadSongId',
    value: function getDownloadSongId(body) {
      return body.data.id;
    }
  }, {
    key: 'modifyPlayerApiCustom',
    value: function modifyPlayerApiCustom(urlInfo, body) {
      console.log('Player API Injected'.green);
      console.log('New URL is '.green + urlInfo.url);
      body.url = urlInfo.url;
      body.br = urlInfo.bitrate;
      body.code = '200';
      body.size = urlInfo.filesize;
      body.md5 = urlInfo.hash;
      body.type = urlInfo.type;

      return body;
    }
  }, {
    key: 'modifyDownloadApiCustom',
    value: function modifyDownloadApiCustom(urlInfo, body) {
      console.log('Download API Injected'.green);
      console.log('New URL is '.green + urlInfo.url);
      body.data.url = urlInfo.url;
      body.data.br = urlInfo.bitrate;
      body.data.code = '200';
      body.data.size = urlInfo.filesize;
      body.data.md5 = urlInfo.hash;
      body.data.type = 'mp3';

      return (0, _stringify2.default)(body);
    }
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
  return netease;
}();

exports.default = netease;