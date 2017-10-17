'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.changeColumn(
      'Users',
      'isSingle',
      {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      }
    )
    queryInterface.changeColumn(
      'Users',
      'facebookName',
      {
        type: Sequelize.STRING,
        allowNull: false
      }
    )
    queryInterface.changeColumn(
      'Users',
      'facebookId',
      {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      }
    )
  },

  down: (queryInterface, Sequelize) => {
    queryInterface.changeColumn(
      'Users',
      'isSingle',
      {
        type: Sequelize.BOOLEAN
      }
    )
    queryInterface.changeColumn(
      'Users',
      'facebookName',
      {
        type: Sequelize.STRING
      }
    )
    queryInterface.changeColumn(
      'Users',
      'facebookId',
      {
        type: Sequelize.STRING,
        unique: true
      }
    )
  }
}
