var express = require('express')
var router = express.Router()
var models = require('../models')
var helper = require('./helper')
var CustomError = helper.CustomError
var SERVER_ERROR_MSG = helper.SERVER_ERROR_MSG

function checkAuth (singleId, friendId) {
  return new Promise(function (resolve, reject) {
    models.Friendships.findOne({
      where: {
        single: singleId,
        friend: friendId
      }
    }).then(fs => {
      if (fs) {
        resolve() // friendship exists
      } else {
        reject(new CustomError('InvalidFriendshipIdError', `User id ${friendId} not friend of User id ${singleId}`, 'Unauthorized access'))
      }
    })
  })
}

function getUser (singleId) {
  return new Promise(function (resolve, reject) {
    models.Users.findOne({
      where: { id: singleId }
    }).then(user => {
      if (user) {
        resolve(user)
      } else {
        reject(new CustomError('InvalidUserIdError', `Invalid User id ${singleId}`, 'Invalid User id'))
      }
    }).catch(e => {
      reject(e)
    })
  })
}

function getSeenCandidates (singleId, friendId) {
  return models.Users.findAll({
    attributes: ['id'],
    include: [{
      model: models.Matches,
      where: {
        friend: friendId,
        single: singleId
      },
      as: 'candidates',
      required: true,
      attributes: []
    }]
  })
}

router.get('/friend/:id', function (req, res) {
  // TODO: add match algorithm
  // TODO: shuffle candidates

  var friendId = req.user.userId
  var singleId = req.params.id

  var permission = checkAuth(singleId, friendId)
  var user = getUser(singleId)
  var seenCandidates = getSeenCandidates(singleId, friendId)

  Promise.all([permission, user, seenCandidates]).then(([permission, user, seenCandidates]) => {
    var seenCandidatesList = seenCandidates.map(function (candidate) { return candidate.id })
    return models.Users.findAll({
      where: {
        id: {
          $notIn: seenCandidatesList.concat([singleId, friendId])
        },
        isSingle: true,
        sex: user.sexualOrientation,
        age: { $between: [user.minAge, user.maxAge] },
        sexualOrientation: user.sex,
        minAge: { $lte: user.age },
        maxAge: { $gte: user.age }
      },
      attributes: {
        exclude: ['facebookToken', 'minAge', 'maxAge', 'sexualOrientation', 'createdAt', 'updatedAt']
      },
      limit: 10
    })
  }).then(candidates => {
    helper.successLog(req.originalUrl, `friend id ${friendId} gets candidates for single id ${singleId}`)
    res.json(candidates)
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

router.post('/friend/:id', function (req, res) {
  var friendId = req.user.userId
  var singleId = req.params.id
  var candidateId = req.body.candidateId
  var friendChoice = req.body.friendChoice

  checkAuth(singleId, friendId).then(_ => {
    return models.Matches.create({
      single: singleId,
      friend: friendId,
      candidate: candidateId,
      friendChoice: friendChoice
    })
  }).then(match => {
    helper.successLog(req.originalUrl, `friend id ${friendId} swipes ${friendChoice} to candidate id ${candidateId} for single id ${singleId}`)
    res.json({})
  }).catch(e => {
    if (e.name === 'InvalidFriendshipIdError') {
      helper.errorLog(req.originalUrl, e)
      return res.status(400).send({ message: e.clientMsg })
    } else {
      helper.errorLog(req.originalUrl, e)
      return res.status(500).send({ message: SERVER_ERROR_MSG })
    }
  })
})

router.get('/single', function (req, res) {
  var singleId = req.user.userId

  models.Users.findAll({
    attributes: ['id'],
    include: [{
      model: models.Matches,
      where: {
        single: singleId,
        singleChoice: {
          $in: [true, false]
        }
      },
      as: 'candidates',
      required: true,
      attributes: []
    }]
  }).then(seenCandidates => {
    var seenCandidatesList = seenCandidates.map(function (candidate) { return candidate.id })
    return models.Users.findAll({
      where: {
        id: { $notIn: seenCandidatesList }
      },
      attributes: {
        exclude: ['facebookToken', 'minAge', 'maxAge', 'sexualOrientation', 'createdAt', 'updatedAt']
      },
      include: [{
        model: models.Matches,
        where: {
          single: singleId,
          friendChoice: true,
          singleChoice: null
        },
        as: 'candidates',
        required: true,
        attributes: []
      }]
    })
  }).then(candidates => {
    helper.successLog(req.originalUrl, `single id ${singleId} gets candidates`)
    res.json(candidates)
  }).catch(e => {
    helper.errorLog(req.originalUrl, e)
    return res.status(500).send({ message: SERVER_ERROR_MSG })
  })
})

router.post('/single', function (req, res) {
  var singleId = req.user.userId
  var candidateId = req.body.candidateId
  var singleChoice = req.body.singleChoice

  models.Matches.findOne({
    where: {
      single: singleId,
      candidate: candidateId
    }
  }).then(match => {
    return match.updateAttributes({
      singleChoice: singleChoice
    })
  }).then(match => {
    helper.successLog(req.originalUrl, `single id ${singleId} swipes ${singleChoice} to candidate id ${candidateId}`)
    res.json({})
  }).catch(e => {
    helper.errorLog(req.originalUrl, e)
    return res.status(500).send({ message: SERVER_ERROR_MSG })
  })
})

module.exports = router
