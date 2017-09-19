'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.get = undefined;

var _models = require('../../models');

const get = exports.get = async ctx => {
  const { songId } = ctx.params;
  if (!/^\d+$/.test(songId)) {
    ctx.body = {
      error: -1
    };
  } else {
    const pair = await _models.Pair.findOne({
      include: [{
        as: 'song',
        model: _models.Song
      }],
      order: [['updatedAt', 'DESC']]
    });
    if (pair) {
      ctx.body = {
        error: 0,
        result: pair
      };
    } else {
      ctx.body = {
        error: -2
      };
    }
  }
};

exports.default = get;