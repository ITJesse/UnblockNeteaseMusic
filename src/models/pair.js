export default (sequelize, DataTypes) => {
  const Pair = sequelize.define('Pair', {
    songId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    plugin: DataTypes.STRING,
    name: DataTypes.STRING,
    artist: DataTypes.STRING,
    album: DataTypes.STRING,
    albumPic: DataTypes.STRING,
    hash: DataTypes.STRING,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  });

  Pair.associate = (Song) => {
    Pair.hasOne(Song, {
      foreignKey: 'songId',
      as: 'song',
    });
  };

  return Pair;
};
