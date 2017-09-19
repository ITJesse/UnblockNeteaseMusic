import Sequelize from 'sequelize';

import config from '../config';
import song from './song';
import recent from './recent';
import pair from './pair';

const sequelize = new Sequelize('unblock', 'unblock', 'unblock', {
  dialect: 'sqlite',
  storage: config.databasePath ? config.databasePath : './unblock.sqlite',
  debug: !!config.verbose,
});


export const Song = song(sequelize, Sequelize);
export const Recent = recent(sequelize, Sequelize);
export const Pair = pair(sequelize, Sequelize);

Recent.associate(Song);
Pair.associate(Song);

Song.sync();
Recent.sync();
Pair.sync();

export default sequelize;
