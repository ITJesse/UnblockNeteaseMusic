'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

require('colors');

var _utils = require('../utils');

var _utils2 = _interopRequireDefault(_utils);

var _netease = require('../utils/netease');

var _netease2 = _interopRequireDefault(_netease);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var utils = new _utils2.default();

var modify = function () {
  var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(ctx, next) {
    var req, songId, urlInfo, data, newData, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, row, playbackReturnCode;

    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            req = ctx.request;
            songId = void 0;
            urlInfo = void 0;
            data = void 0;
            _context.prev = 4;

            data = JSON.parse(ctx.defaultBody.toString());
            _context.next = 12;
            break;

          case 8:
            _context.prev = 8;
            _context.t0 = _context['catch'](4);

            console.error('Parse JSON failed, return with no modify.'.yellow);
            return _context.abrupt('return', next);

          case 12:
            if (!/^\/eapi\/song\/enhance\/player\/url/.test(req.url)) {
              _context.next = 60;
              break;
            }

            newData = [];
            _iteratorNormalCompletion = true;
            _didIteratorError = false;
            _iteratorError = undefined;
            _context.prev = 17;
            _iterator = (0, _getIterator3.default)(data.data);

          case 19:
            if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
              _context.next = 41;
              break;
            }

            row = _step.value;
            playbackReturnCode = row.code;

            songId = row.id;

            if (!(playbackReturnCode !== 200)) {
              _context.next = 36;
              break;
            }

            _context.prev = 24;
            _context.next = 27;
            return utils.getUrlInfo(songId);

          case 27:
            urlInfo = _context.sent;
            _context.next = 33;
            break;

          case 30:
            _context.prev = 30;
            _context.t1 = _context['catch'](24);
            return _context.abrupt('return', console.log(_context.t1));

          case 33:
            if (urlInfo) {
              row = _netease2.default.modifyPlayerApiCustom(urlInfo, row);
            } else {
              console.log('No resource.'.red);
            }
            _context.next = 37;
            break;

          case 36:
            console.log('Playback bitrate is not changed. The song URL is '.green + row.url);

          case 37:
            newData.push(row);

          case 38:
            _iteratorNormalCompletion = true;
            _context.next = 19;
            break;

          case 41:
            _context.next = 47;
            break;

          case 43:
            _context.prev = 43;
            _context.t2 = _context['catch'](17);
            _didIteratorError = true;
            _iteratorError = _context.t2;

          case 47:
            _context.prev = 47;
            _context.prev = 48;

            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }

          case 50:
            _context.prev = 50;

            if (!_didIteratorError) {
              _context.next = 53;
              break;
            }

            throw _iteratorError;

          case 53:
            return _context.finish(50);

          case 54:
            return _context.finish(47);

          case 55:
            data.data = newData;
            ctx.defaultBody = (0, _stringify2.default)(data);
            return _context.abrupt('return', next);

          case 60:
            if (!/^\/eapi\/song\/enhance\/download\/url/.test(req.url)) {
              _context.next = 76;
              break;
            }

            if (!(_netease2.default.getDownloadReturnCode(data) !== 200)) {
              _context.next = 74;
              break;
            }

            songId = _netease2.default.getDownloadSongId(data);
            _context.prev = 63;
            _context.next = 66;
            return utils.getUrlInfo(songId);

          case 66:
            urlInfo = _context.sent;
            _context.next = 72;
            break;

          case 69:
            _context.prev = 69;
            _context.t3 = _context['catch'](63);
            return _context.abrupt('return', console.log(_context.t3));

          case 72:
            if (urlInfo) {
              ctx.defaultBody = _netease2.default.modifyDownloadApiCustom(urlInfo, data);
            } else {
              console.log('No resource.'.red);
            }
            return _context.abrupt('return', next);

          case 74:
            console.log('Download bitrate is not changed. The song URL is '.green + _netease2.default.getDownloadUrl(data).green);
            return _context.abrupt('return', next);

          case 76:
            return _context.abrupt('return', next);

          case 77:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined, [[4, 8], [17, 43, 47, 55], [24, 30], [48,, 50, 54], [63, 69]]);
  }));

  return function modify(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

exports.default = modify;