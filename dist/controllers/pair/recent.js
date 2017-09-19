'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.recent = undefined;

var _models = require('../../models');

const recent = exports.recent = async ctx => {
  const recents = await _models.Recent.findAll({
    include: [{
      as: 'song',
      model: _models.Song
    }],
    order: [['updatedAt', 'DESC']],
    limit: 50
  });
  ctx.body = {
    error: 0,
    result: recents.map(e => e.dataValues)
  };
};

exports.default = recent;