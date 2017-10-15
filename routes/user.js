var models = require('../models')
var helper = require('./helper')
var express = require('express')
var router = express.Router()
var passport = require('passport')

router.post('/createFriend', function (req, res) {
  models.Users.create({
    isUser: false,
    name: req.body.name,
    facebookId: req.body.facebookId
  }).then(user => {
    helper.successLog(req.originalUrl, 'User=' + user.id + ' is created')
    return res.send(JSON.stringify({ 'success': '' }))
  }).catch(e => {
    helper.errorLog(req.originalUrl, e)
    return res.status(500).send(JSON.stringify({ 'error': '' }))
  })
})

router.post('/createUser', passport.authenticate(['jwt'], { session: false }), function (req, res) {
  models.Users.create({
    isUser: true,
    nickname: req.body.nickname,
    sex: req.body.sex,
    sexualOrientation: req.body.sexualOrientation,
    desc: req.body.desc
  }).then(user => {
    models.UserFriends.create({
      user: user.id,
      friend: 1 // TODO
    }).then(uf => {
      helper.successLog(req.originalUrl, 'User=' + user.id + ' is created and User=' + uf.friend + ' is friend')
      return res.send(JSON.stringify({ 'success': '' }))
    }).catch(e => {
      helper.errorLog(req.originalUrl, e)
      return res.status(500).send(JSON.stringify({ 'error': '' }))
    })
  }).catch(e => {
    helper.errorLog(req.originalUrl, e)
    return res.status(500).send(JSON.stringify({ 'error': '' }))
  })
})

router.post('/verifyUser', function (req, res) {
  // TODO: populate name and facebookId
  // TODO: handle case where User is already a Friend
})

function editLive (req, res, isLive) {
  var facebookId = '789' // TODO
  models.Users.findOne({
    where: { facebookId: facebookId }
  }).then(user => {
    if (user) {
      user.updateAttributes({
        isLive: isLive
      }).then(user => {
        helper.successLog(req.originalUrl, 'User=' + user.id + ' isLive=' + isLive)
        return res.send(JSON.stringify({ 'success': '' }))
      })
    } else {
      return new Promise(function (resolve, reject) {
        reject(new Error('User w facebookId=' + facebookId + ' is not found'))
      })
    }
  }).catch(e => {
    helper.errorLog(req.originalUrl, e)
    return res.status(500).send(JSON.stringify({ 'error': '' }))
  })
}

router.post('/startLive', function (req, res) {
  editLive(req, res, true)
})

router.post('/stopLive', function (req, res) {
  editLive(req, res, false)
})

router.post('/editProfile', function (req, res) {
  var facebookId = '789' // TODO
  models.Users.findOne({
    where: { facebookId: facebookId }
  }).then(user => {
    if (user) {
      user.updateAttributes({
        nickname: req.body.nickname,
        sex: req.body.sex,
        sexualOrientation: req.body.sexualOrientation,
        desc: req.body.desc
      }).then(user => {
        helper.successLog(req.originalUrl, 'User=' + user.id + '\'s profile is edited')
        return res.send(JSON.stringify({ 'success': '' }))
      })
    } else {
      return new Promise(function (resolve, reject) {
        reject(new Error('User w facebookId=' + facebookId + ' is not found'))
      })
    }
  }).catch(e => {
    helper.errorLog(req.originalUrl, e)
    return res.status(500).send(JSON.stringify({ 'error': '' }))
  })
})

router.post('/addFriend', function (req, res) {
  var facebookId = '789' // TODO
  var friendFacebookID = req.body.friendFacebookID

  var user = helper.getUser(models, facebookId)
  var friend = helper.getUser(models, friendFacebookID)

  Promise.all([user, friend]).then(([user, friend]) => {
    models.UserFriends.findOrCreate({
      where: {
        user: user.id,
        friend: friend.id
      }
    }).then(uf => {
      helper.successLog(req.originalUrl, 'User=' + uf[0].friend + ' is friend of User=' + uf[0].user)
      return res.send(JSON.stringify({ 'success': '' }))
    }).catch(e => {
      helper.errorLog(req.originalUrl, e)
      return res.status(500).send(JSON.stringify({ 'error': '' }))
    })
  }).catch(e => {
    helper.errorLog(req.originalUrl, e)
    return res.status(500).send(JSON.stringify({ 'error': '' }))
  })
})

router.post('/removeFriend', function (req, res) {
  var facebookId = '789' // TODO
  var friendFacebookID = req.body.friendFacebookID

  var user = helper.getUser(models, facebookId)
  var friend = helper.getUser(models, friendFacebookID)

  Promise.all([user, friend]).then(([user, friend]) => {
    models.UserFriends.findOne({
      where: {
        user: user.id,
        friend: friend.id
      }
    }).then(uf => {
      if (uf) {
        uf.destroy()
        helper.successLog(req.originalUrl, 'User=' + friend.id + ' is now not friend of User=' + user.id)
        return res.send(JSON.stringify({ 'success': '' }))
      } else {
        helper.successLog(req.originalUrl, 'User=' + friend.id + ' is originally not friend of User=' + user.id)
        return res.send(JSON.stringify({ 'success': '' }))
      }
    }).catch(e => {
      helper.errorLog(req.originalUrl, e)
      return res.status(500).send(JSON.stringify({ 'error': '' }))
    })
  }).catch(e => {
    helper.errorLog(req.originalUrl, e)
    return res.status(500).send(JSON.stringify({ 'error': '' }))
  })
})

module.exports = router
