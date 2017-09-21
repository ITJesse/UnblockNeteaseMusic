'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _recent = require('./recent');

Object.defineProperty(exports, 'recent', {
  enumerable: true,
  get: function () {
    return _recent.recent;
  }
});

var _list = require('./list');

Object.defineProperty(exports, 'list', {
  enumerable: true,
  get: function () {
    return _list.list;
  }
});

var _save = require('./save');

Object.defineProperty(exports, 'save', {
  enumerable: true,
  get: function () {
    return _save.save;
  }
});

var _get = require('./get');

Object.defineProperty(exports, 'get', {
  enumerable: true,
  get: function () {
    return _get.get;
  }
});

var _unpair = require('./unpair');

Object.defineProperty(exports, 'unpair', {
  enumerable: true,
  get: function () {
    return _unpair.unpair;
  }
});
const check = exports.check = ctx => {
  ctx.body = {
    error: 0,
    result: 'ok'
  };
};