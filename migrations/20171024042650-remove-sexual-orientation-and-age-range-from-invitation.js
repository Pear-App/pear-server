'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.removeColumn('Invitations', 'sexualOrientation')
    queryInterface.removeColumn('Invitations', 'minAge')
    queryInterface.removeColumn('Invitations', 'maxAge')
  },

  down: (queryInterface, Sequelize) => {
    queryInterface.addColumn(
      'Invitations',
      'sexualOrientation',
      {
        type: Sequelize.ENUM('M', 'F', 'B'),
        allowNull: false
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
  }
}
