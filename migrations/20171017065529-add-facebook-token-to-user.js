'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.addColumn(
      'Users',
      'facebookToken',
      {
        type: Sequelize.STRING,
        allowNull: false
      })
  },

  down: (queryInterface, Sequelize) => {
    queryInterface.removeColumn(
      'Users',
      'facebookToken',
      {
        type: Sequelize.STRING,
        allowNull: false
      })
  }
}
