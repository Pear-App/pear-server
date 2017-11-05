module.exports = function (io) {
  var express = require('express')
  var router = express.Router()

  router.use('/authenticate', require('./authenticate'))
  router.use('/deauthenticate', require('./deauthenticate'))
  router.use('/user', require('./user'))
  router.use('/invitation', require('./invitation'))
  router.use('/match', require('./match')(io))
  router.use('/room', require('./room')(io))
  router.use('/photo', require('./photo'))
  router.use('/push', require('./push'))

  return router
}
