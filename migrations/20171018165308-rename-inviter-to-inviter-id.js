'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.renameColumn('Invitations', 'inviter', 'inviterId')
  },

  down: (queryInterface, Sequelize) => {
    queryInterface.renameColumn('Invitations', 'inviterId', 'inviter')
  }
}
