'use strict'

module.exports = function (sequelize, Sequelize) {
  var Blacklists = sequelize.define('Blacklists', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    blocker: {
      type: Sequelize.INTEGER,
      references: {
        model: 'Users',
        key: 'id'
      },
      allowNull: false,
      unique: 'uniqueBlacklist'
    },
    blockee: {
      type: Sequelize.INTEGER,
      references: {
        model: 'Users',
        key: 'id'
      },
      allowNull: false,
      unique: 'uniqueBlacklist'
    },
    createdAt: {
      type: Sequelize.DATE,
      allowNull: false
    },
    updatedAt: Sequelize.DATE
  })

  return Blacklists
}
