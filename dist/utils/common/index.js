'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sendRequest = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _requestPromise = require('request-promise');

var _requestPromise2 = _interopRequireDefault(_requestPromise);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const sendRequest = exports.sendRequest = async options => {
  const defaults = {
    method: 'get',
    followRedirect: true,
    timeout: 10000,
    resolveWithFullResponse: true
  };
  options = _extends({}, defaults, options);
  let result;
  try {
    result = await (0, _requestPromise2.default)(options);
  } catch (err) {
    throw new Error(err);
  }
  return result;
};

exports.default = sendRequest;