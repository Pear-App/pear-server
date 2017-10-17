'use strict'

module.exports = function (sequelize, Sequelize) {
  var Invitations = sequelize.define('Invitations', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    inviter: {
      type: Sequelize.INTEGER,
      references: {
        model: 'Users',
        key: 'id'
      },
      allowNull: false
    },
    nickname: {
      type: Sequelize.STRING,
      allowNull: false
    },
    sex: {
      type: Sequelize.ENUM('M', 'F'),
      allowNull: false
    },
    sexualOrientation: {
      type: Sequelize.ENUM('M', 'F', 'B'),
      allowNull: false
    },
    desc: {
      type: Sequelize.STRING,
      allowNull: false
    },
    status: {
      type: Sequelize.ENUM('Y', 'N', 'P'),
      allowNull: false,
      defaultValue: 'P'
    },
    createdAt: {
      type: Sequelize.DATE,
      allowNull: false
    },
    updatedAt: Sequelize.DATE
  })

  Invitations.associate = function (models) {
    Invitations.belongsTo(models.Users, {'as': 'inviter'})
  }

  return Invitations
}
