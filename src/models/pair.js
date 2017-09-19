export default (sequelize, DataTypes) => {
  const Pair = sequelize.define('Pair', {
    songId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    plugin: DataTypes.STRING,
    songHash: DataTypes.STRING,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  });

  return Pair;
};
