'use strict'

module.exports = function (sequelize, Sequelize) {
  var Flaglists = sequelize.define('Flaglists', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    flagger: {
      type: Sequelize.INTEGER,
      references: {
        model: 'Users',
        key: 'id'
      },
      allowNull: false,
      unique: 'uniqueFlaglist'
    },
    flaggee: {
      type: Sequelize.INTEGER,
      references: {
        model: 'Users',
        key: 'id'
      },
      allowNull: false,
      unique: 'uniqueFlaglist'
    },
    reason: {
      // 1: Inappropriate profile
      // 2: Inappropriate messaging
      // 3: Fake profile
      // 4: Other
      type: Sequelize.ENUM('1', '2', '3', '4'),
      allowNull: false
    },
    createdAt: {
      type: Sequelize.DATE,
      allowNull: false
    },
    updatedAt: Sequelize.DATE
  })

  return Flaglists
}
