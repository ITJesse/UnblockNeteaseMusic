'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.unpair = undefined;

var _models = require('../../models');

const unpair = exports.unpair = async ctx => {
  const { songId } = ctx.params;
  const result = {};
  _models.Pair.destroy({
    where: { songId }
  }).then().catch(err => console.log(err));
  result.error = 0;
  ctx.body = result;
};

exports.default = unpair;