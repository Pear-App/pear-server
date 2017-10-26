'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.changeColumn(
      'Friendships',
      'review',
      {
        type: Sequelize.STRING,
        allowNull: true
      }
    )
  },

  down: (queryInterface, Sequelize) => {
    queryInterface.changeColumn(
      'Friendships',
      'review',
      {
        type: Sequelize.STRING,
        allowNull: false
      }
    )
  }
}
