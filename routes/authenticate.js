var helper = require('./helper')
const models = require('../models')
const express = require('express')
const router = express.Router()

const jwt = require('jsonwebtoken')
const fetch = require('node-fetch')

const fbClientId = process.env.PEAR_FB_CLIENT_ID
const fbClientSecret = process.env.PEAR_FB_CLIENT_SECRET

const generateUserToken = (payload) => {
  const expiresIn = '21d'
  const issuer = 'api.pear.me'
  const audience = 'pear.me'
  const secret = process.env.PEAR_JWT_SIGNING_KEY

  const userToken = jwt.sign({}, secret, {
    expiresIn,
    audience,
    issuer,
    subject: JSON.stringify(payload)
  })
  return userToken
}

const exchangeFbToken = (fbToken) => {
  const fullUrl = `https://graph.facebook.com/oauth/access_token?grant_type=fb_exchange_token\
&client_id=${fbClientId}&client_secret=${fbClientSecret}&fb_exchange_token=${fbToken}`
  return fetch(fullUrl).then((response) => response.json())
}

const getFBUser = (fbToken) => {
  const fullUrl = `https://graph.facebook.com/me?access_token=${fbToken}`
  return fetch(fullUrl).then((response) => response.json())
}

router.post('/', (req, res) => {
  const oldFbToken = req.body.fbToken
  const fcmToken = req.body.fcmToken

  if (!oldFbToken) {
    res.status(400).send({
      message: 'FB client access token not found in request body'
    })
    return
  }

  exchangeFbToken(oldFbToken).then((fbResponse) => {
    const newFbToken = fbResponse.access_token
    return newFbToken
  }).then((newFbToken) => {
    return Promise.all([getFBUser(newFbToken), Promise.resolve(newFbToken)])
  }).then((userAndToken) => {
    const facebookUser = userAndToken[0]
    const facebookToken = userAndToken[1]

    const facebookId = facebookUser.id
    const facebookName = facebookUser.name

    var user = models.Users.findOne({
      where: { facebookId: facebookId }
    })
    return Promise.all([user, facebookId, facebookName, facebookToken])
  }).then(([user, facebookId, facebookName, facebookToken]) => {
    if (user) {
      return user.updateAttributes({
        facebookToken,
        fcmToken
      })
    } else {
      return models.Users.create({
        facebookId,
        facebookName,
        facebookToken,
        fcmToken
      })
    }
  }).then((user) => {
    const payload = {
      user: {
        userId: user.id
      }
    }
    const jwt = generateUserToken(payload)
    res.json({ jwt })
  }).catch((err) => {
    helper.errorLog(req.originalUrl, err)
    res.status(500).send({
      message: 'An error occurred with processing your request'
    })
  })
})

module.exports = router
