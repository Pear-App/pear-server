'use strict'

module.exports = function (sequelize, Sequelize) {
  var Rooms = sequelize.define('Rooms', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    // First person will have smaller id
    firstPersonId: {
      type: Sequelize.INTEGER,
      references: {
        model: 'Users',
        key: 'id'
      },
      allowNull: false,
      unique: 'uniqueRoom'
    },
    // Second person will have larger id
    secondPersonId: {
      type: Sequelize.INTEGER,
      references: {
        model: 'Users',
        key: 'id'
      },
      allowNull: false,
      unique: 'uniqueRoom'
    },
    isMatch: {
      type: Sequelize.BOOLEAN,
      allowNull: false
    },
    createdAt: {
      type: Sequelize.DATE,
      allowNull: false
    },
    updatedAt: Sequelize.DATE
  })

  Rooms.associate = function (models) {
    Rooms.belongsTo(models.Users, { as: 'firstPerson' })
    Rooms.belongsTo(models.Users, { as: 'secondPerson' })
    Rooms.hasMany(models.Messages, { as: 'room', foreignKey: 'roomId' })
  }

  return Rooms
}
