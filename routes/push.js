var express = require('express')
var router = express.Router()
var passport = require('passport')
var models = require('../models')
var helper = require('./helper')
var CustomError = helper.CustomError
var SERVER_ERROR_MSG = helper.SERVER_ERROR_MSG

router.use('*', passport.authenticate(['jwt'], { session: false }), function (req, res, next) {
  next()
})

const gcm = require('node-gcm')
const sender = new gcm.Sender(process.env.PEAR_FCM_API_KEY)

router.post('/', function (req, res) {
  const userId = req.user.userId

  models.Users.findById(userId).then(user => {
    return user.updateAttributes({
      fcmToken: req.body.fcmToken
    })
  }).then(user => {
    helper.successLog(req.originalUrl, `Update fcmToken for User id ${user.id}`)
    res.send({})
  }).catch(e => {
    helper.errorLog(req.originalUrl, e)
    return res.status(500).send({ message: SERVER_ERROR_MSG })
  })
})

router.get('/test', function (req, res) {
  const userId = req.user.userId

  models.Users.findById(userId).then(user => {
    if (!user.fcmToken) {
      return new Promise(function (resolve, reject) {
        reject(new CustomError('NoFcmToken', `No fcmToken for User id ${user.id}`, 'No fcmToken'))
      })
    }

    var person = { id: 3, facebookName: 'ABC' } // stub
    var title = 'Pear'
    var body = `New message from ${person.facebookName}`
    var route = `/user/${user.id}/chat/${person.id}`
    var tag = 'message'

    var message = new gcm.Message({
      priority: 'high',
      notification: {
        title: title,
        body: body,
        tag: tag,
        click_action: 'FCM_PLUGIN_ACTIVITY'
      },
      data: {
        title: title,
        text: body,
        route: route
      }
    })

    var regTokens = [user.fcmToken]

    sender.send(message, { registrationTokens: regTokens }, function (err, response) {
      if (err) {
        helper.errorLog(req.originalUrl, `Failed to send push notification to User id ${user.id}: ${err}`)
        res.send({})
      } else {
        helper.successLog(req.originalUrl, `Sent push notification to User id ${user.id}`)
        res.send({})
      }
    })
  }).catch(e => {
    if (e.name === 'NoFcmToken') {
      helper.errorLog(req.originalUrl, e)
      return res.status(400).send({ message: e.clientMsg })
    } else {
      helper.errorLog(req.originalUrl, e)
      return res.status(500).send({ message: SERVER_ERROR_MSG })
    }
  })
})

module.exports = router
