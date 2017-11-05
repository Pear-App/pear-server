'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Blacklists', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      blocker: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
          key: 'id'
        },
        allowNull: false
      },
      blockee: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
          key: 'id'
        },
        allowNull: false
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: Sequelize.DATE
    }, {
      uniqueKeys: {
        uniqueBlacklist: {
          fields: ['blocker', 'blockee']
        }
      }
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Blacklists')
  }
}
