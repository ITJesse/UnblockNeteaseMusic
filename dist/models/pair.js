'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = (sequelize, DataTypes) => {
  const Pair = sequelize.define('Pair', {
    songId: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    plugin: DataTypes.STRING,
    hash: DataTypes.STRING,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  });

  Pair.associate = Song => {
    Pair.hasOne(Song, {
      foreignKey: 'songId',
      as: 'song'
    });
  };

  return Pair;
};