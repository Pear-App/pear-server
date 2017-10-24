'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.addColumn(
      'Friendships',
      'review',
      {
        type: Sequelize.STRING,
        allowNull: false
      }
    )
  },

  down: (queryInterface, Sequelize) => {
    queryInterface.removeColumn('Friendships', 'review')
  }
}
