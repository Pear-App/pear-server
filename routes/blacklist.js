var express = require('express')
var router = express.Router()
var passport = require('passport')
var models = require('../models')
var helper = require('./helper')
var SERVER_ERROR_MSG = helper.SERVER_ERROR_MSG

router.use('*', passport.authenticate(['jwt'], { session: false }), function (req, res, next) {
  next()
})

router.post('/', function (req, res) {
  const blockerId = req.user.userId
  const blockeeId = req.body.blockeeId
  models.Blacklists.create({
    blocker: blockerId,
    blockee: blockeeId
  }).then(blacklist => {
    helper.successLog(req.originalUrl, `user id ${blockerId} blacklisted user id ${blockeeId} with blacklist id ${blacklist.id}`)
    return res.json({})
  }).catch((e) => {
    helper.errorLog(req.originalUrl, e)
    return res.status(500).send({ message: SERVER_ERROR_MSG })
  })
})

router.delete('/', function (req, res) {
  const blockerId = req.user.userId
  const blockeeId = req.body.blockeeId
  models.Blacklists.destroy({
    where: {
      blocker: blockerId,
      blockee: blockeeId
    }
  }).then(blacklist => {
    helper.successLog(req.originalUrl, `user id ${blockerId} unblacklisted user id ${blockeeId}`)
    return res.json({})
  }).catch((e) => {
    helper.errorLog(req.originalUrl, e)
    return res.status(500).send({ message: SERVER_ERROR_MSG })
  })
})

module.exports = router
