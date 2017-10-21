'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.removeColumn('Users', 'interests')
    queryInterface.removeColumn('Invitations', 'interests')
  },

  down: (queryInterface, Sequelize) => {
    queryInterface.addColumn(
      'Users',
      'interests',
      {
        type: Sequelize.STRING
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
  }
}
