'use strict'

module.exports = function (sequelize, Sequelize) {
  var Invitations = sequelize.define('Invitations', {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
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
    age: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    minAge: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    maxAge: {
      type: Sequelize.INTEGER,
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
    Invitations.belongsTo(models.Users, { as: 'inviter', foreignKey: 'inviterId' })
  }

  return Invitations
}
