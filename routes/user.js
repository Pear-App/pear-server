var express = require('express')
var router = express.Router()
var models = require('../models')
var helper = require('./helper')
var CustomError = helper.CustomError
var SERVER_ERROR_MSG = helper.SERVER_ERROR_MSG

function checkAuth (singleId, friendId) {
  return new Promise(function (resolve, reject) {
    if (singleId === String(friendId)) {
      resolve() // can edit own profile
    } else {
      models.Friendships.findOne({
        where: {
          single: singleId,
          friend: friendId
        }
      }).then(fs => {
        if (fs) {
          resolve() // friends can edit profile
        } else {
          reject(new CustomError('InvalidFriendshipIdError', `User id ${friendId} not friend of User id ${singleId}`, 'Unauthorized edit'))
        }
      })
    }
  })
}

router.post('/:id/edit', function (req, res) {
  var singleId = req.params.id
  var friendId = req.user.userId

  checkAuth(singleId, friendId).then(_ => {
    return models.Users.findOne({
      where: { id: singleId }
    })
  }).then(user => {
    if (user) {
      return user.updateAttributes({
        nickname: req.body.nickname,
        sex: req.body.sex,
        sexualOrientation: req.body.sexualOrientation,
        age: req.body.age,
        minAge: req.body.minAge,
        maxAge: req.body.maxAge,
        interests: req.body.interests,
        desc: req.body.desc
      })
    } else {
      return new Promise(function (resolve, reject) {
        reject(new CustomError('InvalidUserIdError', `Invalid User id ${singleId}`, 'Invalid User id'))
      })
    }
  }).then(user => {
    helper.successLog(req.originalUrl, `Edited profile of User id ${singleId}`)
    return res.json(user)
  }).catch(e => {
    if (e.name === 'InvalidUserIdError' || e.name === 'InvalidFriendshipIdError') {
      helper.errorLog(req.originalUrl, e)
      return res.status(400).send({ message: e.clientMsg })
    } else {
      helper.errorLog(req.originalUrl, e)
      return res.status(500).send({ message: SERVER_ERROR_MSG })
    }
  })
})

router.post('/friend', function (req, res) {
  models.Friendships.findOrCreate({
    where: {
      single: req.user.userId,
      friend: req.body.friendId
    }
  }).then(fs => {
    helper.successLog(req.originalUrl, `Created Friendship where single id ${fs[0].single} and friend id ${fs[0].friend}`)
    return res.json({})
  }).catch(e => {
    helper.errorLog(req.originalUrl, e)
    return res.status(500).send({ message: SERVER_ERROR_MSG })
  })
})

router.delete('/friend', function (req, res) {
  var singleId = req.user.userId
  var friendId = req.body.friendId

  models.Friendships.findOne({
    where: {
      single: singleId,
      friend: friendId
    }
  }).then(fs => {
    if (fs) {
      return fs.destroy()
    } else {
      return new Promise(function (resolve, reject) {
        resolve() // friendship not found
      })
    }
  }).then(_ => {
    helper.successLog(req.originalUrl, `Deleted Friendship where single id ${singleId} and friend id ${friendId}`)
    return res.json({})
  }).catch(e => {
    helper.errorLog(req.originalUrl, e)
    return res.status(500).send({ message: SERVER_ERROR_MSG })
  })
})

router.get('/me', function (req, res) {
  models.Users.findById(req.user.userId, {
    include: [
      {
        model: models.Users,
        as: 'friend',
        attributes: ['id', 'facebookName', 'facebookId'],
        through: { attributes: [] }
      },
      {
        model: models.Users,
        as: 'single',
        attributes: ['id', 'facebookName', 'facebookId'],
        through: { attributes: [] }
      }
    ]
  }).then(user => {
    if (user) {
      helper.successLog(req.originalUrl, `GET friends of User id ${req.user.userId}`)
      return res.json(user)
    } else {
      // should not reach here ever
      return new Promise(function (resolve, reject) {
        reject(new CustomError('InvalidUserIdError', `Invalid User id ${req.user.userId}`, 'Invalid User id'))
      })
    }
  }).catch(e => {
    helper.errorLog(req.originalUrl, e)
    return res.status(500).send({ message: SERVER_ERROR_MSG })
  })
})

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

module.exports = router
