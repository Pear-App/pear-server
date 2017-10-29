'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.renameColumn('Rooms', 'firstSingleId', 'firstPersonId')
    queryInterface.renameColumn('Rooms', 'secondSingleId', 'secondPersonId')
    queryInterface.addColumn(
      'Rooms',
      'isMatch',
      {
        type: Sequelize.BOOLEAN,
        allowNull: false
      }
    )
  },

  down: (queryInterface, Sequelize) => {
    queryInterface.renameColumn('Rooms', 'firstPersonId', 'firstSingleId')
    queryInterface.renameColumn('Rooms', 'secondPersonId', 'secondSingleId')
    queryInterface.removeColumn('Rooms', 'isMatch')
  }
}
