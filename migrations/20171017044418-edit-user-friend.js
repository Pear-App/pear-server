'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.renameColumn('UserFriends', 'user', 'single')
  },

  down: (queryInterface, Sequelize) => {
    queryInterface.renameColumn('UserFriends', 'single', 'user')
  }
}
