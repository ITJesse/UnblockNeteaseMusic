export default (sequelize, DataTypes) => {
  const Song = sequelize.define('Song', {
    songId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    name: DataTypes.STRING,
    artist: DataTypes.STRING,
    album: DataTypes.STRING,
    albumPic: DataTypes.STRING,
  });

  return Song;
};
