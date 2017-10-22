const express = require('express')
const router = express.Router()
const base64url = require('base64url')
const crypto = require('crypto')
const models = require('../models')
const helper = require('./helper')
const CustomError = helper.CustomError

function parse (signedRequest) {
  var encodedData = signedRequest.split('.')
  var sig = encodedData[0]
  var data = JSON.parse(base64url.decode(encodedData[1]))

  if (!data.algorithm || data.algorithm.toUpperCase() !== 'HMAC-SHA256') {
    return Promise.reject(new CustomError('UnknownAlgorithmError', 'Expected HMAC-SHA256', ''))
  }

  var expectedSig = crypto.createHmac('sha256', process.env.PEAR_FB_CLIENT_SECRET).update(encodedData[1]).digest('base64').replace(/\+/g, '-').replace(/\//g, '_').replace('=', '')
  if (sig !== expectedSig) {
    return Promise.reject(new CustomError('BadJSONSigError', 'Bad JSON signature', ''))
  }

  return Promise.resolve(data['user_id'])
}

router.post('/', function (req, res) {
  parse(req.body.signed_request).then(userId => {
    return new Promise(function (resolve, reject) {
      models.Users.findById(userId).then(user => {
        if (user) {
          resolve(user)
        } else {
          reject(new CustomError('InvalidUserIdError', `Invalid User id ${userId}`, 'Invalid User id'))
        }
      }).catch(e => {
        reject(e)
      })
    })
  }).then(user => {
    return user.updateAttributes({
      isSingle: false
    })
  }).then(user => {
    var _ = models.Friendships.destroy({
      where: { single: user.id }
    })
    Promise.all([_, user]).then(([_, user]) => {
      helper.successLog(req.originalUrl, `Deauthenticated user ${user.id}`)
      return res.send({})
    })
  }).catch(e => {
    if (e.name === 'InvalidUserIdError' || e.name === 'UnknownAlgorithmError' || e.name === 'BadJSONSigError') {
      helper.errorLog(req.originalUrl, e)
      return res.status(400).send({})
    } else {
      helper.errorLog(req.originalUrl, e)
      return res.status(500).send({})
    }
  })
})

module.exports = router
