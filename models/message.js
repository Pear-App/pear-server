'use strict'

module.exports = function (sequelize, Sequelize) {
  var Messages = sequelize.define('Messages', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    ownerId: {
      type: Sequelize.INTEGER,
      references: {
        model: 'Users',
        key: 'id'
      },
      allowNull: false
    },
    roomId: {
      type: Sequelize.INTEGER,
      references: {
        model: 'Rooms',
        key: 'id'
      },
      allowNull: false
    },
    text: {
      type: Sequelize.STRING,
      allowNull: false
    },
    createdAt: {
      type: Sequelize.DATE,
      allowNull: false
    },
    updatedAt: Sequelize.DATE
  })

  Messages.associate = function (models) {
    Messages.belongsTo(models.Users, { as: 'owner' })
    Messages.belongsTo(models.Rooms, { as: 'room' })
  }

  return Messages
}
