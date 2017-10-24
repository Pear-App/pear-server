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
    school: {
      type: Sequelize.STRING
    },
    major: {
      type: Sequelize.STRING
    },
    sex: {
      type: Sequelize.ENUM('M', 'F')
    },
    sexualOrientation: {
      type: Sequelize.ENUM('M', 'F', 'B')
    },
    age: {
      type: Sequelize.INTEGER
    },
    minAge: {
      type: Sequelize.INTEGER
    },
    maxAge: {
      type: Sequelize.INTEGER
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
    facebookToken: {
      type: Sequelize.STRING,
      allowNull: false
    },
    createdAt: {
      type: Sequelize.DATE,
      allowNull: false
    },
    updatedAt: Sequelize.DATE
  })

  Users.associate = function (models) {
    Users.belongsToMany(Users, { through: 'Friendships', as: 'single', foreignKey: 'friend' })
    Users.belongsToMany(Users, { through: 'Friendships', as: 'friend', foreignKey: 'single' })
    Users.hasMany(models.Invitations, { as: 'inviter', foreignKey: 'inviterId' })
    Users.hasMany(models.Matches, { as: 'candidates', foreignKey: 'candidate' })
    Users.hasMany(models.Matches, { as: 'singles', foreignKey: 'single' })
    Users.hasMany(models.Matches, { as: 'friends', foreignKey: 'friend' })
    Users.hasMany(models.Rooms, { as: 'firstSingle', foreignKey: 'firstSingleId' })
    Users.hasMany(models.Rooms, { as: 'secondSingle', foreignKey: 'secondSingleId' })
  }

  return Users
}
