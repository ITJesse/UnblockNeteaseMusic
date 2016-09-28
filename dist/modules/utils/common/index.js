'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

var _extend = require('extend');

var _extend2 = _interopRequireDefault(_extend);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var common = {};

common.sendRequest = function (options) {
  var defaults = {
    method: 'get',
    followRedirect: true,
    timeout: 5000
  };
  options = (0, _extend2.default)(false, defaults, options);
  return new _promise2.default(function (resolve, reject) {
    (0, _request2.default)(options, function (err, res, body) {
      if (err) {
        reject(err);
      } else {
        resolve([res, body]);
      }
    });
  });
};

exports.default = common;
//# sourceMappingURL=index.js.map