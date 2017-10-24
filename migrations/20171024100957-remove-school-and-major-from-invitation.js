'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.removeColumn('Invitations', 'school')
    queryInterface.removeColumn('Invitations', 'major')
  },

  down: (queryInterface, Sequelize) => {
    queryInterface.addColumn(
      'Invitations',
      'school',
      {
        type: Sequelize.STRING,
        allowNull: false
      }
    )
    queryInterface.addColumn(
      'Invitations',
      'major',
      {
        type: Sequelize.STRING,
        allowNull: false
      }
    )
  }
}
