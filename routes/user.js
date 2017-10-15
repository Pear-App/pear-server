var models = require('../models')
var helper = require('./helper')
var express = require('express')
var router = express.Router()

router.post('/createFriend', function (req, res) {
  models.Users.create({
    isUser: false,
    name: req.body.name,
    facebookId: req.body.facebookId
  }).then(user => {
    helper.successLog(req.originalUrl, 'User=' + user.id + ' is created')
    res.send(JSON.stringify({ 'success': '' }))
  }).catch(e => {
    helper.errorLog(req.originalUrl, e)
    res.send(JSON.stringify({ 'error': '' }))
  })
})

router.post('/createUser', function (req, res) {
  models.Users.create({
    isUser: true,
    nickname: req.body.nickname,
    sex: req.body.sex,
    sexualOrientation: req.body.sexualOrientation,
    desc: req.body.desc
  }).then(user => {
    helper.successLog(req.originalUrl, 'User=' + user.id + ' is created')
    res.send(JSON.stringify({ 'success': '' }))
  }).catch(e => {
    helper.errorLog(req.originalUrl, e)
    res.send(JSON.stringify({ 'error': '' }))
  })
  // TODO: add to UserFriends
  // models.UserFriends.create({
  //   user: user.id,
  //   friend: 1
  // })
})

router.post('/verifyUser', function (req, res) {
  // TODO: populate name and facebookId
  // TODO: handle case where User is already a Friend
})

function editLive (req, res, isLive) {
  var facebookId = '1234' // TODO
  models.Users.findOne({
    where: { facebookId: facebookId }
  }).then(user => {
    if (user) {
      user.updateAttributes({
        isLive: isLive
      }).then(user => {
        helper.successLog(req.originalUrl, 'User=' + user.id + ' isLive=' + isLive)
        res.send(JSON.stringify({ 'success': '' }))
      })
    } else {
      return new Promise(function (resolve, reject) {
        reject(new Error('User w facebookId=' + facebookId + ' is not found'))
      })
    }
  }).catch(e => {
    helper.errorLog(req.originalUrl, e)
    res.send(JSON.stringify({ 'error': '' }))
  })
}

router.post('/startLive', function (req, res) {
  editLive(req, res, true)
})

router.post('/stopLive', function (req, res) {
  editLive(req, res, false)
})

module.exports = router
