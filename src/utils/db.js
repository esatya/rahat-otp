const { Sequelize } = require('sequelize');
const path = require('path');
const config = require('config');

module.exports = new Sequelize('database', '', '', {
  host: '0.0.0.0',
  dialect: 'sqlite',
  pool: {
    max: 5,
    min: 0,
    idle: 10000
  },
  logging: false,
  storage: path.resolve(config.get('db'))
});
