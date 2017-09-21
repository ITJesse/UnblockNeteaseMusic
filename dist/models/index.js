'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Pair = exports.Recent = exports.Song = undefined;

var _sequelize = require('sequelize');

var _sequelize2 = _interopRequireDefault(_sequelize);

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

var _song = require('./song');

var _song2 = _interopRequireDefault(_song);

var _recent = require('./recent');

var _recent2 = _interopRequireDefault(_recent);

var _pair = require('./pair');

var _pair2 = _interopRequireDefault(_pair);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const sequelize = new _sequelize2.default('unblock', 'unblock', 'unblock', {
  dialect: 'sqlite',
  storage: _config2.default.databasePath ? _config2.default.databasePath : './unblock.sqlite',
  logging: _config2.default.verbose ? console.log : false
});

const Song = exports.Song = (0, _song2.default)(sequelize, _sequelize2.default);
const Recent = exports.Recent = (0, _recent2.default)(sequelize, _sequelize2.default);
const Pair = exports.Pair = (0, _pair2.default)(sequelize, _sequelize2.default);

Recent.associate(Song);
Pair.associate(Song);

Song.sync();
Recent.sync();
Pair.sync();

exports.default = sequelize;