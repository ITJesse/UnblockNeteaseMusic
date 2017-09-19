'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.save = undefined;

var _models = require('../../models');

const save = exports.save = async ctx => {
  const req = ctx.request;
  const result = {};
  const { songId, plugin, hash } = req.body;
  if (!/^QQ Music|Kugou$/.test(plugin)) {
    result.error = -1;
    ctx.body = result;
  } else if (!/^\d+$/.test(songId)) {
    result.error = -1;
    ctx.body = result;
  } else if (!/^[0-9,a-z,A-Z]+$/.test(songId)) {
    result.error = -1;
    ctx.body = result;
  } else {
    _models.Pair.upsert({
      songId, plugin, hash
    }).then().catch(err => console.log(err));
    _models.Recent.destroy({
      where: { songId }
    }).then().catch(err => console.log(err));
    result.error = 0;
    ctx.body = result;
  }
};

exports.default = save;