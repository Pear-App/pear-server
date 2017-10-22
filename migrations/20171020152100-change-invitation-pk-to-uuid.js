'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.changeColumn(
      'Invitations',
      'id',
      {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        autoIncrement: false
      }
    )
  },

  down: (queryInterface, Sequelize) => {
    queryInterface.changeColumn(
      'Invitations',
      'id',
      {
        type: Sequelize.INTEGER,
        autoIncrement: true
      }
    )
  }
}
