var express = require('express')
var router = express.Router()
var passport = require('passport')
var models = require('../models')
var fetch = require('node-fetch')
var request = require('request')
var helper = require('./helper')
var CustomError = helper.CustomError
var SERVER_ERROR_MSG = helper.SERVER_ERROR_MSG

router.use('*', passport.authenticate(['jwt'], { session: false }), function (req, res, next) {
  next()
})

function getProfileAlbum (user, albums) {
  return new Promise(function (resolve, reject) {
    albums.data.map(function (value) {
      if (value.name === 'Profile Pictures') {
        resolve(value.id)
      }
    })
    reject(new CustomError('NoProfilePicturesAlbum', `No Profile Pictures album for User ${user.id}`, 'No Profile Pictures album'))
  })
}

function getProfilePhotos (user) {
  return new Promise(function (resolve, reject) {
    var albumUrl = `https://graph.facebook.com/${user.facebookId}/albums?access_token=${user.facebookToken}`
    fetch(albumUrl).then(response => {
      return response.json()
    }).then(albums => {
      return getProfileAlbum(user, albums)
    }).then(albumId => {
      var photoUrl = `https://graph.facebook.com/${albumId}/photos?access_token=${user.facebookToken}`
      return fetch(photoUrl)
    }).then(response => {
      return response.json()
    }).then(photos => {
      photos = photos.data.map(function (photo) {
        return photo.id
      })
      resolve(photos)
    }).catch(e => {
      reject(e)
    })
  })
}

function storePhoto (photoId, s3, facebookToken, size) {
  return new Promise(function (resolve, reject) {
    var url = `https://graph.facebook.com/${photoId}/picture?access_token=${facebookToken}&type=${size}`
    var key = size + photoId
    request({
      url: url,
      encoding: null
    }, function (err, res, body) {
      if (err) { reject(err) }
      s3.putObject({
        Bucket: 'pear-server',
        Key: key,
        ContentType: res.headers['content-type'],
        ContentLength: res.headers['content-length'],
        Body: body // buffer
      }, function (err, res) {
        if (err) { reject(err) }
        resolve(photoId)
      })
    })
  })
}

function storePhotos (photoIds, s3, facebookToken, size) {
  var promises = []
  photoIds.map(function (photoId) {
    var promise = storePhoto(photoId, s3, facebookToken, size)
    promises.push(promise)
  })
  return Promise.all(promises)
}

function addPhoto (photoId, order, userId) {
  return models.Photos.create({
    ownerId: userId,
    photoId: photoId,
    order: order
  })
}

function addPhotos (photoIds, userId) {
  return new Promise(function (resolve, reject) {
    var destroyPhotos = models.Photos.findAll({
      where: { ownerId: userId }
    }).then(photos => {
      photos.map(function (photo) {
        photo.destroy()
      })
    })

    Promise.all([destroyPhotos]).then(_ => {
      var promises = []
      photoIds.forEach(function (photoId, order) {
        var promise = addPhoto(photoId, order, userId)
        promises.push(promise)
      })
      return Promise.all(promises)
    }).then(_ => {
      resolve()
    }).catch(e => {
      reject(e)
    })
  })
}

function preloadPhotos (user, s3) {
  return new Promise(function (resolve, reject) {
    getProfilePhotos(user).then(photoIds => {
      return storePhotos(photoIds.slice(0, 6), s3, user.facebookToken, 'normal')
    }).then(photoIds => {
      return addPhotos(photoIds, user.id)
    }).then(photoIds => {
      resolve(photoIds)
    }).catch(e => {
      reject(e)
    })
  })
}

router.get('/', function (req, res) {
  var s3 = req.app.get('s3')
  var userId = req.user.userId
  var facebookToken = null

  models.Users.findById(userId).then(user => {
    if (user) {
      facebookToken = user.facebookToken
      return getProfilePhotos(user)
    } else {
      return new Promise(function (resolve, reject) {
        reject(new CustomError('InvalidUserIdError', `Invalid User id ${userId}`, 'Invalid User id'))
      })
    }
  }).then(photoIds => {
    return storePhotos(photoIds, s3, facebookToken, 'album')
  }).then(photoIds => {
    helper.successLog(req.originalUrl, `GET profile pictures of User ${userId} from Facebook`)
    return res.send(photoIds)
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

router.post('/', function (req, res) {
  var s3 = req.app.get('s3')
  var userId = req.user.userId
  var photoIds = req.body.photoIds.slice(0, 6)

  models.Users.findById(userId).then(user => {
    if (user) {
      return storePhotos(photoIds, s3, user.facebookToken, 'normal')
    } else {
      return new Promise(function (resolve, reject) {
        reject(new CustomError('InvalidUserIdError', `Invalid User id ${userId}`, 'Invalid User id'))
      })
    }
  }).then(_ => {
    return models.sequelize.transaction(function (t) {
      return addPhotos(photoIds, userId)
    })
  }).then(_ => {
    helper.successLog(req.originalUrl, `Updated photos of User ${userId}`)
    return res.send({})
  }).catch(e => {
    helper.errorLog(req.originalUrl, e)
    return res.status(500).send({ message: SERVER_ERROR_MSG })
  })
})

module.exports = router
module.exports.preloadPhotos = preloadPhotos
