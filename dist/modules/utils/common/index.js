'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var common = {};

common.sendRequest = function (options) {
  var defaults = {
    method: 'get',
    followRedirect: true,
    timeout: 5000
  };
  options = (0, _extends3.default)({}, defaults, options);
  return new _promise2.default(function (resolve, reject) {
    (0, _request2.default)(options, function (err, res, body) {
      if (err) {
        reject(err);
      } else {
        var result = {
          res: res,
          body: body
        };
        resolve(result);
      }
    });
  });
};

exports.default = common;