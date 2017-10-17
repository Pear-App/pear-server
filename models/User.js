'use strict'

module.exports = function (sequelize, Sequelize) {
  var Users = sequelize.define('Users', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    isSingle: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
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
    facebookName: {
      type: Sequelize.STRING,
      allowNull: false
    },
    facebookId: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    },
    createdAt: {
      type: Sequelize.DATE,
      allowNull: false
    },
    updatedAt: Sequelize.DATE
  })

  Users.associate = function (models) {
    Users.belongsToMany(Users, { through: 'UserFriends', as: 'user', foreignKey: 'friend' })
    Users.belongsToMany(Users, { through: 'UserFriends', as: 'friend', foreignKey: 'user' })
    Users.hasMany(models.Invitations, {'as': 'invitations'})
  }

  return Users
}
