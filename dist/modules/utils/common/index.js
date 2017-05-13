'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sendRequest = undefined;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _requestPromise = require('request-promise');

var _requestPromise2 = _interopRequireDefault(_requestPromise);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var sendRequest = exports.sendRequest = function () {
  var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(options) {
    var defaults, result;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            defaults = {
              method: 'get',
              followRedirect: true,
              timeout: 10000,
              resolveWithFullResponse: true
            };

            options = (0, _assign2.default)({}, defaults, options);
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
    }, _callee, undefined, [[3, 9]]);
  }));

  return function sendRequest(_x) {
    return _ref.apply(this, arguments);
  };
}();

exports.default = sendRequest;