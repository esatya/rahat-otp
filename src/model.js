const Sequelize = require('sequelize');
const db = require('./utils/db');

module.exports = db.define(
  'otp',
  {
    phone: { type: Sequelize.STRING, allowNull: false, unique: true },
    otp: { type: Sequelize.STRING },
    expireOn: { type: Sequelize.NUMBER }
  },
  {
    freezeTableName: true,
    timestamps: false
  }
);
