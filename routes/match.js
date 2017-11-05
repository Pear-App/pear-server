module.exports = function (io) {
  var express = require('express')
  var router = express.Router()
  var passport = require('passport')
  var models = require('../models')
  var helper = require('./helper')
  var CustomError = helper.CustomError
  var SERVER_ERROR_MSG = helper.SERVER_ERROR_MSG

  router.use('*', passport.authenticate(['jwt'], { session: false }), function (req, res, next) {
    next()
  })

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

  function getSex (user) {
    return new Promise(function (resolve, reject) {
      if (user.sexualOrientation === 'B') {
        resolve(['M', 'F'])
      } else {
        resolve([user.sexualOrientation])
      }
    })
  }

  function getSexualOrientation (user) {
    return new Promise(function (resolve, reject) {
      if (user.sexualOrientation === 'B') {
        resolve([user.sexualOrientation])
      } else {
        resolve([user.sex])
      }
    })
  }

  function createFriendNotification (friendId, singleId) {
    return new Promise(function (resolve, reject) {
      Promise.all([
        models.Rooms.findOne({
          where: {
            firstPersonId: Math.min(friendId, singleId),
            secondPersonId: Math.max(friendId, singleId)
          }
        }),
        models.Users.findById(singleId)
      ]).then(([room, singleUser]) => {
        if (room && singleUser) {
          return models.Messages.create({
            ownerId: singleId,
            isEvent: true,
            roomId: room.id,
            text: `Hooray! ${singleUser.facebookName} just matched with a date recommmended by you!`
          })
        } else {
          reject(new CustomError('InvalidFriendNoticationError', `Either cannot find room between user id ${friendId} and user id ${singleId} or cannot find user id ${singleId} `, 'Invalid Friend Notification'))
        }
      }).then(message => resolve(message))
    })
  }

  router.get('/friend/:id', function (req, res) {
    // TODO: add match algorithm

    var friendId = req.user.userId
    var singleId = req.params.id

    var permission = checkAuth(singleId, friendId)
    var user = getUser(singleId)
    var seenCandidates = getSeenCandidates(singleId, friendId)

    Promise.all([permission, user, seenCandidates]).then(([permission, user, seenCandidates]) => {
      var seenCandidatesList = seenCandidates.map(function (candidate) { return candidate.id })
      var sex = getSex(user)
      var sexualOrientation = getSexualOrientation(user)
      return Promise.all([user, seenCandidatesList, sex, sexualOrientation])
    }).then(([user, seenCandidatesList, sex, sexualOrientation]) => {
      return models.Users.findAll({
        where: {
          id: {
            $notIn: seenCandidatesList.concat([singleId, friendId])
          },
          isSingle: true,
          sex: { $in: sex },
          age: { $between: [user.minAge, user.maxAge] },
          sexualOrientation: { $in: sexualOrientation },
          minAge: { $lte: user.age },
          maxAge: { $gte: user.age }
        },
        attributes: {
          exclude: ['facebookToken', 'minAge', 'maxAge', 'sexualOrientation', 'createdAt', 'updatedAt']
        },
        include: [
          {
            model: models.Users,
            as: 'friend',
            attributes: ['id', 'facebookName', 'facebookId'],
            through: { attributes: ['review'] }
          },
          {
            model: models.Photos,
            as: 'photos',
            attributes: ['photoId']
          }
        ],
        limit: 10
      })
    }).then(candidates => {
      candidates = candidates.map(function (candidate) {
        const candidateData = candidate.dataValues
        candidateData.photos = candidateData.photos.map(helper.getPhotoId)
        return candidateData
      })
      candidates = helper.shuffle(candidates)
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
        include: [
          {
            model: models.Matches,
            where: {
              single: singleId,
              friendChoice: true,
              singleChoice: null
            },
            as: 'candidates',
            required: true,
            attributes: []
          },
          {
            model: models.Users,
            as: 'friend',
            attributes: ['id', 'facebookName', 'facebookId'],
            through: { attributes: ['review'] }
          },
          {
            model: models.Photos,
            as: 'photos',
            attributes: ['photoId']
          }
        ]
      })
    }).then(candidates => {
      candidates = candidates.map(function (candidate) {
        const candidateData = candidate.dataValues
        candidateData.photos = candidateData.photos.map(helper.getPhotoId)
        return candidateData
      })
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
    Promise.all([
      models.Matches.findOne({
        where: {
          single: singleId,
          candidate: candidateId
        }
      }),
      models.Matches.findOne({
        where: {
          single: candidateId,
          candidate: singleId
        }
      })
    ]).then(([currentMatch, oppositeMatch]) => {
      const matchUpdate = currentMatch.updateAttributes({
        singleChoice: singleChoice
      })
      if (singleChoice && oppositeMatch && oppositeMatch.singleChoice) {
        return Promise.all([
          matchUpdate,
          models.Rooms.create({
            firstPersonId: Math.min(singleId, candidateId),
            secondPersonId: Math.max(singleId, candidateId),
            isMatch: true
          })
        ])
      }
      return Promise.all([
        matchUpdate,
        null
      ])
    }).then(([currentMatch, room]) => {
      if (room) {
        helper.successLog(req.originalUrl, `mutual match completed by single id ${singleId} created a room id ${room.id}`)
        return createFriendNotification(currentMatch.friend, currentMatch.single)
      }
      helper.successLog(req.originalUrl, `single id ${singleId} swipes ${singleChoice} to candidate id ${candidateId}`)
      return null
    }).then(message => {
      if (message) {
        helper.successLog(req.originalUrl, `message id ${message.id} created to notify matchmaker of user id ${singleId} of successful match`)
        io.to(`${message.roomId}`).emit('message', message)
      }
      res.json({})
    }).catch(e => {
      if (e.name === 'InvalidFriendNoticationError') {
        helper.errorLog(req.originalUrl, e)
        return res.status(500).send({ message: SERVER_ERROR_MSG })
      } else {
        helper.errorLog(req.originalUrl, e)
        return res.status(500).send({ message: SERVER_ERROR_MSG })
      }
    })
  })
  return router
}
