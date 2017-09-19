import Sequelize from 'sequelize';

import song from './song';
import recent from './recent';
import pair from './pair';

const sequelize = new Sequelize('unblock', 'unblock', 'unblock', {
  dialect: 'sqlite',
  storage: './unblock.sqlite',
});


export const Song = song(sequelize, Sequelize);
export const Recent = recent(sequelize, Sequelize);
export const Pair = pair(sequelize, Sequelize);

Recent.associate(Song);

Song.sync();
Recent.sync();
Pair.sync();

export default sequelize;
