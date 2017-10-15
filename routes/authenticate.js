// var helper = require('./helper')
const models = require('../models')
const express = require('express')
const router = express.Router()

const jwt = require('jsonwebtoken')
const fetch = require('node-fetch')

const fbClientId = process.env.PEAR_FB_CLIENT_ID
const fbClientSecret = process.env.PEAR_FB_CLIENT_SECRET

const generateUserToken = (payload) => {
  const expiresIn = '1d'
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

  if (!oldFbToken) {
    res.status(400).send({
      status: 400,
      message: 'FB client access token not found in request body',
      token: null
    })
    return
  }

  exchangeFbToken(oldFbToken).then((fbResponse) => {
    const newFbToken = fbResponse.access_token
    return newFbToken
  }).then((newFbToken) => {
    return Promise.all([getFBUser(newFbToken), Promise.resolve(newFbToken)])
  }).then((userAndToken) => {
    const user = userAndToken[0]
    const fbToken = userAndToken[1]

    const fbId = user.id
    const displayName = user.name.substring(0, 25)
    return Promise.all([
      models.Users.findOrCreate({
        where: {
          facebookId: fbId
        },
        facebookId: fbId,
        displayName
      }),
      Promise.resolve(fbToken)
    ])
  }).then((userAndToken) => {
    const user = userAndToken[0]
    const fbToken = userAndToken[1]
    const payload = {
      user
    }
    const jwtToken = generateUserToken(payload)
    res.json({
      fbToken,
      jwtToken
    })
  }).catch((err) => {
    console.error(err)
    res.status(500).send({
      status: 500,
      message: 'An error occurred with processing your request',
      token: null
    })
  })
})

module.exports = router
