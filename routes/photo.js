var express = require('express')
var router = express.Router()
var passport = require('passport')
var models = require('../models')
var fetch = require('node-fetch')
var helper = require('./helper')
var CustomError = helper.CustomError
var SERVER_ERROR_MSG = helper.SERVER_ERROR_MSG

router.use('*', passport.authenticate(['jwt'], { session: false }), function (req, res, next) {
  next()
})

router.get('/', function (req, res) {
  var userId = req.user.userId
  var facebookToken = null

  models.Users.findById(userId).then(user => {
    if (user) {
      facebookToken = user.facebookToken
      var albumUrl = `https://graph.facebook.com/${user.facebookId}/albums?access_token=${user.facebookToken}`
      return fetch(albumUrl)
    } else {
      return new Promise(function (resolve, reject) {
        reject(new CustomError('InvalidUserIdError', `Invalid User id ${userId}`, 'Invalid User id'))
      })
    }
  }).then(response => {
    return response.json()
  }).then(albums => {
    return new Promise(function (resolve, reject) {
      albums.data.forEach(function (value) {
        if (value.name === 'Profile Pictures') {
          resolve(value.id)
        }
      })
      reject(new CustomError('NoProfilePicturesAlbum', `No Profile Pictures album for User ${userId}`, 'No Profile Pictures album'))
    })
  }).then(albumId => {
    var photoUrl = `https://graph.facebook.com/${albumId}/photos?access_token=${facebookToken}`
    return fetch(photoUrl)
  }).then(response => {
    return response.json()
  }).then(photos => {
    var photoIds = photos.data.map(function (value) {
      return value.id
    })
    helper.successLog(req.originalUrl, `GET profile pictures of User ${userId} from Facebook`)
    res.send(photoIds)
  }).catch(e => {
    if (e.name === 'InvalidUserIdError' || e.name === 'NoProfilePicturesAlbum') {
      helper.errorLog(req.originalUrl, e)
      return res.status(400).send({ message: e.clientMsg })
    } else {
      helper.errorLog(req.originalUrl, e)
      return res.status(500).send({ message: SERVER_ERROR_MSG })
    }
  })
})

module.exports = router
