'use strict'

module.exports = function (sequelize, Sequelize) {
  var Rooms = sequelize.define('Rooms', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    // First single will have smaller id
    firstSingleId: {
      type: Sequelize.INTEGER,
      references: {
        model: 'Users',
        key: 'id'
      },
      allowNull: false,
      unique: 'uniqueRoom'
    },
    // Second single will have larger id
    secondSingleId: {
      type: Sequelize.INTEGER,
      references: {
        model: 'Users',
        key: 'id'
      },
      allowNull: false,
      unique: 'uniqueRoom'
    },
    createdAt: {
      type: Sequelize.DATE,
      allowNull: false
    },
    updatedAt: Sequelize.DATE
  })

  Rooms.associate = function (models) {
    Rooms.belongsTo(models.Users, { as: 'firstSingle' })
    Rooms.belongsTo(models.Users, { as: 'secondSingle' })
    Rooms.hasMany(models.Messages, { as: 'room' })
  }

  return Rooms
}
