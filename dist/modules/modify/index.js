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
          songId = void 0, urlInfo = void 0;

          if (!/^\/eapi\/song\/enhance\/player\/url/.test(req.url)) {
            _context.next = 60;
            break;
          }

          data = '';
          _context.prev = 5;

          data = JSON.parse(ctx.defaultBody);
          _context.next = 13;
          break;

        case 9:
          _context.prev = 9;
          _context.t0 = _context['catch'](5);

          console.error(_context.t0);
          return _context.abrupt('return', next);

        case 13:
          newData = [];
          _iteratorNormalCompletion = true;
          _didIteratorError = false;
          _iteratorError = undefined;
          _context.prev = 17;
          _iterator = (0, _getIterator3.default)(data["data"]);

        case 19:
          if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
            _context.next = 41;
            break;
          }

          row = _step.value;
          playbackReturnCode = row.code;

          songId = row.id;

          if (!(playbackReturnCode != 200)) {
            _context.next = 36;
            break;
          }

          _context.prev = 24;
          _context.next = 27;
          return _regenerator2.default.awrap(utils.getUrlInfo(songId));

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
            row = utils.netease.modifyPlayerApiCustom(urlInfo, row);
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
          data["data"] = newData;
          ctx.defaultBody = (0, _stringify2.default)(data);
          return _context.abrupt('return', next);

        case 60:
          if (!/^\/eapi\/song\/enhance\/download\/url/.test(req.url)) {
            _context.next = 80;
            break;
          }

          if (!(utils.netease.getDownloadReturnCode(ctx.defaultBody) != 200)) {
            _context.next = 76;
            break;
          }

          songId = utils.netease.getDownloadSongId(ctx.defaultBody);
          _context.prev = 63;
          _context.next = 66;
          return _regenerator2.default.awrap(utils.getUrlInfo(songId));

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
            ctx.defaultBody = utils.netease.modifyDownloadApiCustom(urlInfo, ctx.defaultBody);
          } else {
            console.log('No resource.'.red);
          }
          return _context.abrupt('return', next);

        case 76:
          console.log('Download bitrate is not changed. The song URL is '.green + utils.netease.getDownloadUrl(ctx.defaultBody).green);
          return _context.abrupt('return', next);

        case 78:
          _context.next = 81;
          break;

        case 80:
          return _context.abrupt('return', next);

        case 81:
        case 'end':
          return _context.stop();
      }
    }
  }, null, this, [[5, 9], [17, 43, 47, 55], [24, 30], [48,, 50, 54], [63, 69]]);
};

exports.default = modify;
//# sourceMappingURL=index.js.map