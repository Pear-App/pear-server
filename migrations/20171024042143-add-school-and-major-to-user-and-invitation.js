'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.addColumn(
      'Users',
      'school',
      {
        type: Sequelize.STRING
      }
    )
    queryInterface.addColumn(
      'Users',
      'major',
      {
        type: Sequelize.STRING
      }
    )
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
  },

  down: (queryInterface, Sequelize) => {
    queryInterface.removeColumn('Users', 'school')
    queryInterface.removeColumn('Users', 'major')
    queryInterface.removeColumn('Invitations', 'school')
    queryInterface.removeColumn('Invitations', 'major')
  }
}
