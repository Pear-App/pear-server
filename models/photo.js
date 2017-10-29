'use strict'

module.exports = function (sequelize, Sequelize) {
  var Photos = sequelize.define('Photos', {
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
    order: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    photoId: {
      type: Sequelize.STRING,
      allowNull: false
    },
    createdAt: {
      type: Sequelize.DATE,
      allowNull: false
    },
    updatedAt: Sequelize.DATE
  })

  Photos.associate = function (models) {
    Photos.belongsTo(models.Users, { as: 'owner', foreignKey: 'ownerId' })
  }

  return Photos
}
