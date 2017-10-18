'use strict'

module.exports = function (sequelize, Sequelize) {
  var Matches = sequelize.define('Matches', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    candidate: {
      type: Sequelize.INTEGER,
      references: {
        model: 'Users',
        key: 'id'
      },
      allowNull: false,
      unique: 'uniqueMatch'
    },
    single: {
      type: Sequelize.INTEGER,
      references: {
        model: 'Users',
        key: 'id'
      },
      allowNull: false,
      unique: 'uniqueMatch'
    },
    friend: {
      type: Sequelize.INTEGER,
      references: {
        model: 'Users',
        key: 'id'
      },
      allowNull: false,
      unique: 'uniqueMatch'
    },
    singleChoice: {
      type: Sequelize.BOOLEAN
    },
    friendChoice: {
      type: Sequelize.BOOLEAN
    },
    createdAt: {
      type: Sequelize.DATE,
      allowNull: false
    },
    updatedAt: Sequelize.DATE
  })

  Matches.associate = function (models) {
    Matches.belongsTo(models.Users, { as: 'candidates', foreignKey: 'candidate' })
    Matches.belongsTo(models.Users, { as: 'singles', foreignKey: 'single' })
    Matches.belongsTo(models.Users, { as: 'friends', foreignKey: 'friend' })
  }

  return Matches
}
