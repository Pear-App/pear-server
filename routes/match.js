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

function getCandidates (singleId) {
  return new Promise(function (resolve, reject) {
    models.Users.findOne({
      where: { id: singleId }
    }).then(user => {
      if (user) {
        models.Users.findAll({
          where: {
            isSingle: true,
            sex: user.sexualOrientation,
            age: { $between: [user.minAge, user.maxAge] },
            sexualOrientation: user.sex,
            minAge: { $lte: user.age },
            maxAge: { $gte: user.age }
          },
          attributes: ['id']
        }).then(candidates => {
          resolve(candidates)
        }).catch(e => {
          reject(e)
        })
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

router.get('/:id/friend', function (req, res) {
  // TODO: add match algorithm
  // TODO: shuffle candidates

  var friendId = req.user.userId
  var singleId = req.params.id

  var permission = checkAuth(singleId, friendId)
  var candidates = getCandidates(singleId)
  var seenCandidates = getSeenCandidates(singleId, friendId)

  Promise.all([permission, candidates, seenCandidates]).then(([permission, candidates, seenCandidates]) => {
    var candidatesList = candidates.map(function (candidate) { return candidate.id })
    var seenCandidatesList = seenCandidates.map(function (candidate) { return candidate.id })
    return models.Users.findAll({
      where: {
        id: {
          $in: candidatesList,
          $notIn: seenCandidatesList.concat([singleId, friendId])
        }
      },
      limit: 10
    })
  }).then(candidates => {
    helper.successLog(req.originalUrl, `friend id ${friendId} GET candidates for single id ${singleId}`)
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

router.post('/:id/friend', function (req, res) {
  var friendId = req.user.userId
  var singleId = req.params.id
  var candidateId = req.body.candidateId
  var choice = req.body.choice

  checkAuth(singleId, friendId).then(_ => {
    return models.Matches.create({
      single: singleId,
      friend: friendId,
      candidate: candidateId,
      friendChoice: choice
    })
  }).then(match => {
    helper.successLog(req.originalUrl, `Created Match id ${match.id} where single id ${singleId}, friend id ${friendId}, candidate id ${candidateId}`)
    helper.successLog(req.originalUrl, `For Match id ${match.id}, friend swiped ${choice}`)
    res.json({})
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

router.get('/:id/single', function (req, res) {
  res.json('') // TODO
})

router.post('/:id/single', function (req, res) {
  res.json('') // TODO
})

module.exports = router
