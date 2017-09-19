'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.list = undefined;

var _models = require('../../models');

const list = exports.list = async ctx => {
  const pairs = await _models.Pair.findAll({
    include: [{
      as: 'song',
      model: _models.Song
    }],
    order: [['updatedAt', 'DESC']]
  });
  ctx.body = {
    error: 0,
    result: pairs.map(e => e.dataValues)
  };
};

exports.default = list;