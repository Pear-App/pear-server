'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.removeColumn('Users', 'isLive')
    queryInterface.renameColumn('Users', 'isUser', 'isSingle')
    queryInterface.renameColumn('Users', 'name', 'facebookName')
  },

  down: (queryInterface, Sequelize) => {
    queryInterface.addColumn('Users', 'isLive', Sequelize.STRING)
    queryInterface.renameColumn('Users', 'isSingle', 'isUser')
    queryInterface.renameColumn('Users', 'facebookName', 'name')
  }
}
