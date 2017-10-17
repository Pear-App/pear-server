'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.addColumn(
      'Users',
      'minAge',
      {
        type: Sequelize.INTEGER
      }
    )
    queryInterface.addColumn(
      'Users',
      'maxAge',
      {
        type: Sequelize.INTEGER
      }
    )
    queryInterface.addColumn(
      'Users',
      'interests',
      {
        type: Sequelize.STRING
      }
    )
    queryInterface.addColumn(
      'Invitations',
      'minAge',
      {
        type: Sequelize.INTEGER,
        allowNull: false
      }
    )
    queryInterface.addColumn(
      'Invitations',
      'maxAge',
      {
        type: Sequelize.INTEGER,
        allowNull: false
      }
    )
    queryInterface.addColumn(
      'Invitations',
      'interests',
      {
        type: Sequelize.STRING,
        allowNull: false
      }
    )
  },

  down: (queryInterface, Sequelize) => {
    queryInterface.removeColumn('Users', 'minAge')
    queryInterface.removeColumn('Users', 'maxAge')
    queryInterface.removeColumn('Users', 'interests')
    queryInterface.removeColumn('Invitations', 'minAge')
    queryInterface.removeColumn('Invitations', 'maxAge')
    queryInterface.removeColumn('Invitations', 'interests')
  }
}
