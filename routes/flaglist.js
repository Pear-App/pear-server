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
  const flaggerId = req.user.userId
  const flaggeeId = req.body.flaggeeId
  models.Flaglists.create({
    flagger: flaggerId,
    flaggee: flaggeeId,
    reason: req.body.reason
  }).then(flaglist => {
    helper.successLog(req.originalUrl, `user id ${flaggerId} flagged user id ${flaggeeId} with flaglist id ${flaglist.id}`)
    return res.json({})
  }).catch((e) => {
    helper.errorLog(req.originalUrl, e)
    return res.status(500).send({ message: SERVER_ERROR_MSG })
  })
})

module.exports = router
