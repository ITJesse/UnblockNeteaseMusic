'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = (sequelize, DataTypes) => {
  const Recent = sequelize.define('Recent', {
    songId: {
      type: DataTypes.INTEGER,
      primaryKey: true
    }
  });

  Recent.associate = Song => {
    Recent.hasOne(Song, {
      foreignKey: 'songId',
      as: 'song'
    });
  };

  return Recent;
};