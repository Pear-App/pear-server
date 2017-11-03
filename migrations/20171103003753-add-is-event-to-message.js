'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.addColumn(
      'Messages',
      'isEvent',
      {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      }
    )
  },

  down: (queryInterface, Sequelize) => {
    queryInterface.removeColumn('Messages', 'isEvent')
  }
}
