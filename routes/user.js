var models = require('../models')
var express = require('express')
var router = express.Router()

router.post('/createFriend', function (req, res) {
  models.Users.create({
    isUser: false,
    name: req.body.name,
    facebookId: req.body.facebookId
  }).then(user => {
    if (user) {
      res.send(JSON.stringify({ 'success': '' }))
    } else {
      res.send(JSON.stringify({ 'error': '' }))
    }
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
    if (user) {
      res.send(JSON.stringify({ 'success': '' }))
    } else {
      res.send(JSON.stringify({ 'error': '' }))
    }
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

module.exports = router
