var express = require('express')
var router = express.Router()
var models = require('../models')
var helper = require('./helper')
var SERVER_ERROR_MSG = helper.SERVER_ERROR_MSG

router.get('/', function (req, res) {
  models.Users.findAll().then(users => {
    const count = users.length
    res.status(200).send(count.toString())
  }).catch((e) => {
    helper.errorLog(req.originalUrl, e)
    return res.status(500).send({ message: SERVER_ERROR_MSG })
  })
})

module.exports = router
