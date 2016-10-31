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

var _colors = require('colors');

var _colors2 = _interopRequireDefault(_colors);

var _utils = require('../utils');

var _utils2 = _interopRequireDefault(_utils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var utils = new _utils2.default();

var modify = function _callee(ctx, next) {
  var req, res, songId, urlInfo, data, newData, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, row, playbackReturnCode;

  return _regenerator2.default.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          req = ctx.request;
          res = ctx.response;
          songId = void 0, urlInfo = void 0, data = void 0;
          _context.prev = 3;

          data = JSON.parse(ctx.defaultBody.toString());
          _context.next = 11;
          break;

        case 7:
          _context.prev = 7;
          _context.t0 = _context['catch'](3);

          console.error("Parse JSON failed, return with no modify.".yellow);
          return _context.abrupt('return', next);

        case 11:
          if (!/^\/eapi\/song\/enhance\/player\/url/.test(req.url)) {
            _context.next = 59;
            break;
          }

          newData = [];
          _iteratorNormalCompletion = true;
          _didIteratorError = false;
          _iteratorError = undefined;
          _context.prev = 16;
          _iterator = (0, _getIterator3.default)(data["data"]);

        case 18:
          if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
            _context.next = 40;
            break;
          }

          row = _step.value;
          playbackReturnCode = row.code;

          songId = row.id;

          if (!(playbackReturnCode != 200)) {
            _context.next = 35;
            break;
          }

          _context.prev = 23;
          _context.next = 26;
          return _regenerator2.default.awrap(utils.getUrlInfo(songId));

        case 26:
          urlInfo = _context.sent;
          _context.next = 32;
          break;

        case 29:
          _context.prev = 29;
          _context.t1 = _context['catch'](23);
          return _context.abrupt('return', console.log(_context.t1));

        case 32:
          if (urlInfo) {
            row = utils.netease.modifyPlayerApiCustom(urlInfo, row);
          } else {
            console.log('No resource.'.red);
          }
          _context.next = 36;
          break;

        case 35:
          console.log('Playback bitrate is not changed. The song URL is '.green + row.url);

        case 36:
          newData.push(row);

        case 37:
          _iteratorNormalCompletion = true;
          _context.next = 18;
          break;

        case 40:
          _context.next = 46;
          break;

        case 42:
          _context.prev = 42;
          _context.t2 = _context['catch'](16);
          _didIteratorError = true;
          _iteratorError = _context.t2;

        case 46:
          _context.prev = 46;
          _context.prev = 47;

          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }

        case 49:
          _context.prev = 49;

          if (!_didIteratorError) {
            _context.next = 52;
            break;
          }

          throw _iteratorError;

        case 52:
          return _context.finish(49);

        case 53:
          return _context.finish(46);

        case 54:
          data["data"] = newData;
          ctx.defaultBody = (0, _stringify2.default)(data);
          return _context.abrupt('return', next);

        case 59:
          if (!/^\/eapi\/song\/enhance\/download\/url/.test(req.url)) {
            _context.next = 79;
            break;
          }

          if (!(utils.netease.getDownloadReturnCode(data) != 200)) {
            _context.next = 75;
            break;
          }

          songId = utils.netease.getDownloadSongId(data);
          _context.prev = 62;
          _context.next = 65;
          return _regenerator2.default.awrap(utils.getUrlInfo(songId));

        case 65:
          urlInfo = _context.sent;
          _context.next = 71;
          break;

        case 68:
          _context.prev = 68;
          _context.t3 = _context['catch'](62);
          return _context.abrupt('return', console.log(_context.t3));

        case 71:
          if (urlInfo) {
            ctx.defaultBody = utils.netease.modifyDownloadApiCustom(urlInfo, data);
          } else {
            console.log('No resource.'.red);
          }
          return _context.abrupt('return', next);

        case 75:
          console.log('Download bitrate is not changed. The song URL is '.green + utils.netease.getDownloadUrl(data).green);
          return _context.abrupt('return', next);

        case 77:
          _context.next = 80;
          break;

        case 79:
          return _context.abrupt('return', next);

        case 80:
        case 'end':
          return _context.stop();
      }
    }
  }, null, this, [[3, 7], [16, 42, 46, 54], [23, 29], [47,, 49, 53], [62, 68]]);
};

exports.default = modify;