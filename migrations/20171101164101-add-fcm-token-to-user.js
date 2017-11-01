'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.addColumn(
      'Users',
      'fcmToken',
      {
        type: Sequelize.STRING
      })
  },

  down: (queryInterface, Sequelize) => {
    queryInterface.removeColumn(
      'Users',
      'fcmToken')
  }
}
