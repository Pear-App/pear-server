var express = require('express')
var router = express.Router()
var models = require('../models')
var helper = require('./helper')
var CustomError = helper.CustomError
var SERVER_ERROR_MSG = helper.SERVER_ERROR_MSG

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
            age: { $between: [user.minAge, user.maxAge] }
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

function getSeenCandidates (friendId, singleId) {
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
  // TODO: check creds
  // TODO: omit self and omit friends
  // TODO: add limits

  var friendId = req.user.userId
  var singleId = req.params.id

  var candidates = getCandidates(singleId)
  var seenCandidates = getSeenCandidates(friendId, singleId)

  Promise.all([candidates, seenCandidates]).then(([candidates, seenCandidates]) => {
    var candidatesList = candidates.map(function (candidate) { return candidate.id })
    var seenCandidatesList = seenCandidates.map(function (candidate) { return candidate.id })
    return models.Users.findAll({
      where: {
        id: {
          $in: candidatesList,
          $notIn: seenCandidatesList
        }
      }
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

router.get('/match/:id/single', function (req, res) {
  res.json('') // TODO
})

router.post('/match/:id/friend', function (req, res) {
  res.json('') // TODO
})

router.post('/match/:id/single', function (req, res) {
  res.json('') // TODO
})

module.exports = router
