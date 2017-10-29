var express = require('express')
var router = express.Router()
var passport = require('passport')
var models = require('../models')
var helper = require('./helper')
var CustomError = helper.CustomError
var SERVER_ERROR_MSG = helper.SERVER_ERROR_MSG
var checkAge = helper.checkAge
var checkAgeRange = helper.checkAgeRange

router.use('*', passport.authenticate(['jwt'], { session: false }), function (req, res, next) {
  next()
})

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
  var age = req.body.age
  var minAge = req.body.minAge
  var maxAge = req.body.maxAge

  checkAge(age, minAge, maxAge).then(_ => {
    return checkAgeRange(minAge, maxAge)
  }).then(_ => {
    return checkAuth(singleId, friendId)
  }).then(_ => {
    return models.Users.findOne({
      where: { id: singleId }
    })
  }).then(user => {
    if (user) {
      return user.updateAttributes({
        nickname: req.body.nickname,
        school: req.body.school,
        major: req.body.major,
        sex: req.body.sex,
        sexualOrientation: req.body.sexualOrientation,
        age: age,
        minAge: minAge,
        maxAge: maxAge,
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
    if (e.name === 'InvalidUserIdError' || e.name === 'InvalidFriendshipIdError' || e.name === 'InvalidAge' || e.name === 'InvalidAgeRange') {
      helper.errorLog(req.originalUrl, e)
      return res.status(400).send({ message: e.clientMsg })
    } else {
      helper.errorLog(req.originalUrl, e)
      return res.status(500).send({ message: SERVER_ERROR_MSG })
    }
  })
})

router.post('/:id/review', function (req, res) {
  var singleId = req.params.id
  var friendId = req.user.userId

  models.Friendships.findOne({
    where: {
      single: singleId,
      friend: friendId
    }
  }).then(fs => {
    if (fs) {
      return fs.updateAttributes({
        review: req.body.review
      })
    } else {
      return new Promise(function (resolve, reject) {
        reject(new CustomError('InvalidFriendshipIdError', `User id ${friendId} not friend of User id ${singleId}`, 'Unauthorized edit'))
      })
    }
  }).then(fs => {
    helper.successLog(req.originalUrl, `User id ${friendId} edited review of User id ${singleId}`)
    return res.json({})
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

// TODO: Make into atomic transaction
router.post('/friend', function (req, res) {
  const userId = req.user.userId
  const friendId = req.body.friendId
  models.Friendships.findOrCreate({
    where: {
      single: userId,
      friend: friendId
    }
  }).then(fs => {
    helper.successLog(req.originalUrl, `Created Friendship where single id ${fs[0].single} and friend id ${fs[0].friend}`)
    return models.Rooms.findOrCreate({
      where: {
        firstPersonId: Math.min(userId, friendId),
        secondPersonId: Math.max(userId, friendId),
        isMatch: false
      }
    })
  }).then(room => {
    if (room) {
      helper.successLog(req.originalUrl, `New friendship found or created a room id ${room.id}`)
    }
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
        through: { attributes: ['review'] }
      },
      {
        model: models.Users,
        as: 'single',
        attributes: ['id', 'facebookName', 'facebookId'],
        through: { attributes: [] }
      },
      {
        model: models.Invitations,
        as: 'inviter',
        attributes: {
          exclude: ['createdAt', 'updatedAt']
        },
        where: {
          status: { $in: ['N', 'P'] }
        },
        required: false
      },
      {
        model: models.Rooms,
        as: 'firstPerson',
        attributes: ['id', 'isMatch'],
        include: [
          {
            model: models.Users,
            as: 'secondPerson',
            attributes: ['id', 'facebookName', 'facebookId']
          }
        ]
      },
      {
        model: models.Rooms,
        as: 'secondPerson',
        attributes: ['id', 'isMatch'],
        include: [
          {
            model: models.Users,
            as: 'firstPerson',
            attributes: ['id', 'facebookName', 'facebookId']
          }
        ]
      },
      {
        model: models.Photos,
        as: 'photos',
        attributes: {
          exclude: ['id', 'ownerId', 'createdAt', 'updatedAt']
        }
      }
    ]
  }).then(user => {
    if (user) {
      // extracting the actual data object from Sequelize model
      const userData = user.dataValues
      // merging two room arrays into one
      userData.rooms = [...userData.firstPerson, ...userData.secondPerson]
      // renaming room person data to a single otherPerson for sanity
      userData.rooms = userData.rooms.map((room) => {
        let newRoom = {
          id: room.id,
          isMatch: room.isMatch
        }
        if (room.firstPerson) {
          newRoom.otherPerson = room.firstPerson
        } else {
          newRoom.otherPerson = room.secondPerson
        }
        return newRoom
      })
      delete userData.firstPerson
      delete userData.secondPerson
      helper.successLog(req.originalUrl, `GET friends of User id ${req.user.userId}`)
      return res.json(userData)
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
    where: {
      id: req.params.id
    },
    include: [{
      model: models.Users,
      as: 'friend',
      attributes: ['id', 'facebookName', 'facebookId'],
      through: { attributes: ['review'] }
    }]
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
