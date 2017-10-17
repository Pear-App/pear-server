'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.renameTable('UserFriends', 'Friendships')
  },

  down: (queryInterface, Sequelize) => {
    queryInterface.renameTable('Friendships', 'UserFriends')
  }
}
