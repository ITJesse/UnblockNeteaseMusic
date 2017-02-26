'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.download = exports.player = undefined;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

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

var player = exports.player = function () {
  var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(ctx, next) {
    var data, playbackReturnCode, songId, urlInfo;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            data = ctx.body;

            // Handle silly linux client forward api

            if (Object.prototype.hasOwnProperty.call(data, 'data')) {
              _context.next = 3;
              break;
            }

            return _context.abrupt('return', next());

          case 3:
            if (Object.prototype.hasOwnProperty.call(data.data[0], 'code')) {
              _context.next = 5;
              break;
            }

            return _context.abrupt('return', next());

          case 5:
            playbackReturnCode = data.data[0].code;
            songId = data.data[0].id;

            if (!(playbackReturnCode === 200)) {
              _context.next = 10;
              break;
            }

            console.log('The song URL is '.green + data.data[0].url);
            return _context.abrupt('return', next());

          case 10:
            urlInfo = void 0;
            _context.prev = 11;
            _context.next = 14;
            return utils.getUrlInfo(songId);

          case 14:
            urlInfo = _context.sent;
            _context.next = 20;
            break;

          case 17:
            _context.prev = 17;
            _context.t0 = _context['catch'](11);
            return _context.abrupt('return', console.log(_context.t0));

          case 20:
            if (urlInfo) {
              data.data[0] = _netease2.default.modifyPlayerApiCustom(urlInfo, data.data[0]);
            } else {
              console.log('No resource.'.red);
            }
            ctx.body = (0, _stringify2.default)(data);
            return _context.abrupt('return', next());

          case 23:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined, [[11, 17]]);
  }));

  return function player(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

var download = exports.download = function () {
  var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(ctx, next) {
    var data, songId, urlInfo;
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            data = ctx.body;

            if (!(_netease2.default.getDownloadReturnCode(data) === 200)) {
              _context2.next = 3;
              break;
            }

            return _context2.abrupt('return', console.log('The song URL is '.green + data.data.url));

          case 3:
            songId = _netease2.default.getDownloadSongId(data);
            urlInfo = void 0;
            _context2.prev = 5;
            _context2.next = 8;
            return utils.getUrlInfo(songId);

          case 8:
            urlInfo = _context2.sent;
            _context2.next = 14;
            break;

          case 11:
            _context2.prev = 11;
            _context2.t0 = _context2['catch'](5);
            return _context2.abrupt('return', console.log(_context2.t0));

          case 14:
            if (urlInfo) {
              ctx.body = _netease2.default.modifyDownloadApiCustom(urlInfo, data);
            } else {
              console.log('No resource.'.red);
            }
            return _context2.abrupt('return', next);

          case 16:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, undefined, [[5, 11]]);
  }));

  return function download(_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}();