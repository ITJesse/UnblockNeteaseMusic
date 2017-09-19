'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.pair = exports.modify = undefined;

var _modify = require('./modify');

var modify = _interopRequireWildcard(_modify);

var _pair = require('./pair');

var pair = _interopRequireWildcard(_pair);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

exports.modify = modify;
exports.pair = pair;