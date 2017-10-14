'use strict'

module.exports = function (sequelize, Sequelize) {
  var user = sequelize.define('Users', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    isLive: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    isUser: {
      type: Sequelize.BOOLEAN
    },
    nickname: {
      type: Sequelize.STRING
    },
    sex: {
      type: Sequelize.ENUM('M', 'F')
    },
    sexualOrientation: {
      type: Sequelize.ENUM('M', 'F', 'B')
    },
    desc: {
      type: Sequelize.STRING
    },
    name: {
      type: Sequelize.STRING
    },
    facebookId: {
      type: Sequelize.STRING,
      unique: true
    },
    createdAt: {
      type: Sequelize.DATE,
      allowNull: false
    },
    updatedAt: Sequelize.DATE
  })
  return user
}
