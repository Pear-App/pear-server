var models = require('../models')
var helper = require('./helper')
var CustomError = helper.CustomError
var SERVER_ERROR_MSG = helper.SERVER_ERROR_MSG
var express = require('express')
var router = express.Router()
var passport = require('passport')

router.get('/:id', function (req, res) {
  models.Users.findOne({
    where: { id: req.params.id }
  }).then(user => {
    if (user) {
      helper.successLog(req.originalUrl, `GET User id ${req.params.id}`)
      return res.json(user)
    } else {
      return new Promise(function (resolve, reject) {
        reject(new CustomError('InvalidUserIdError', `Invalid User id ${req.params.id}`, 'Invalid User id'))
      })
    }
  }).catch(e => {
    if (e.name === 'InvalidUserIdError') {
      helper.errorLog(req.originalUrl, e)
      return res.status(400).send({ message: e.clientMsg })
    } else {
      helper.errorLog(req.originalUrl, e)
      return res.status(500).send({ message: SERVER_ERROR_MSG })
    }
  })
})

router.post('/:id/edit', function (req, res) {
  // TODO: check creds
  models.Users.findOne({
    where: { id: req.params.id }
  }).then(user => {
    if (user) {
      return user.updateAttributes({
        nickname: req.body.nickname,
        sex: req.body.sex,
        sexualOrientation: req.body.sexualOrientation,
        desc: req.body.desc
      })
    } else {
      return new Promise(function (resolve, reject) {
        reject(new CustomError('InvalidUserIdError', `Invalid User id ${req.params.id}`, 'Invalid User id'))
      })
    }
  }).then(user => {
    helper.successLog(req.originalUrl, `Edited profile of User id ${req.params.id}`)
    return res.json(user)
  }).catch(e => {
    if (e.name === 'InvalidUserIdError') {
      helper.errorLog(req.originalUrl, e)
      return res.status(400).send({ message: e.clientMsg })
    } else {
      helper.errorLog(req.originalUrl, e)
      return res.status(500).send({ message: SERVER_ERROR_MSG })
    }
  })
})

module.exports = router
