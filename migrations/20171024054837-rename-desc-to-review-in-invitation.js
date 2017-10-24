'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.renameColumn('Invitations', 'desc', 'review')
  },

  down: (queryInterface, Sequelize) => {
    queryInterface.renameColumn('Invitations', 'review', 'desc')
  }
}
