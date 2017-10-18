var models = require('../models')
var helper = require('./helper')
var CustomError = helper.CustomError
var SERVER_ERROR_MSG = helper.SERVER_ERROR_MSG
var express = require('express')
var router = express.Router()

router.post('/', function (req, res) {
  const inviterId = req.user.userId
  models.Invitations.create({
    inviterId: inviterId,
    nickname: req.body.nickname,
    sex: req.body.sex,
    sexualOrientation: req.body.sexualOrientation,
    age: req.body.age,
    minAge: req.body.minAge,
    maxAge: req.body.maxAge,
    interests: req.body.interests,
    desc: req.body.desc
  }).then(invitation => {
    helper.successLog(req.originalUrl, `Created Invitation with id ${invitation.id} and inviterId ${inviterId}`)
    return res.json({ invitationId: invitation.id })
  }).catch((e) => {
    helper.errorLog(req.originalUrl, e)
    return res.status(500).send({ message: SERVER_ERROR_MSG })
  })
})

router.get('/:id', function (req, res) {
  const invitationId = req.params.id
  models.Invitations.findById(invitationId, {
    include: [{
      model: models.Users,
      as: 'inviter',
      attributes: ['id', 'facebookName', 'facebookId']
    }]
  }).then(invitation => {
    if (!invitation) {
      return Promise.reject(new CustomError('InvalidInvitationIdError', `Invalid Invitation id ${invitationId}`, 'Invalid Invitation id'))
    }
    helper.successLog(req.originalUrl, `GET Invitation with id ${invitationId}`)
    return res.json(invitation)
  }).catch((e) => {
    if (e.name === 'InvalidInvitationIdError') {
      helper.errorLog(req.originalUrl, e)
      return res.status(400).send({ message: e.clientMsg })
    } else {
      helper.errorLog(req.originalUrl, e)
      return res.status(500).send({ message: SERVER_ERROR_MSG })
    }
  })
})

/*
  Queries for a single user and invitation
  (userId, invitationId) -> Promise([userObject, invitationObject])
  throws InvalidUserIdError, InvalidInvitationIdError
*/
function getUserAndInvitation (userId, invitationId) {
  return Promise.all([
    models.Users.findById(userId),
    models.Invitations.findById(invitationId)
  ]).then(([user, invitation]) => {
    if (!user) {
      return Promise.reject(new CustomError('InvalidUserIdError', `Invalid User id ${userId}`, 'Invalid User id'))
    }
    if (!invitation) {
      return Promise.reject(new CustomError('InvalidInvitationIdError', `Invalid Invitation id ${invitationId}`, 'Invalid Invitation id'))
    }
    return [user, invitation]
  })
}

// TODO: Make into atomic transaction
router.post('/:id/accept', function (req, res) {
  const userId = req.user.userId
  const invitationId = req.params.id
  getUserAndInvitation(
    userId,
    invitationId
  ).then(([user, invitation]) => {
    if (invitation.status !== 'P') {
      return Promise.reject(new CustomError('UsedInvitationError', `There is already a response given for Invitation id ${invitationId}`, 'Invalid Invitation id'))
    }
    const friendship = models.Friendships.findOrCreate({
      where: {
        single: userId,
        friend: invitation.inviterId
      }
    })
    return Promise.all([
      Promise.resolve(user),
      Promise.resolve(invitation),
      friendship
    ])
  }).then(([user, invitation, friendship]) => {
    if (friendship) {
      helper.successLog(req.originalUrl, `Created Friendship where single id ${friendship[0].single} and friend id ${friendship[0].friend}`)
    }
    const invitationUpdate = invitation.updateAttributes({
      status: 'Y'
    })
    if (!user.isSingle) {
      const userUpdate = user.updateAttributes({
        nickname: invitation.nickname,
        sex: invitation.sex,
        sexualOrientation: invitation.sexualOrientation,
        age: invitation.age,
        minAge: invitation.minAge,
        maxAge: invitation.maxAge,
        interests: invitation.interests,
        desc: invitation.desc,
        isSingle: true
      })
      return Promise.all([
        invitationUpdate,
        userUpdate
      ])
    }
    return Promise.all([
      invitationUpdate,
      Promise.resolve('Already Single')
    ])
  }).then(([invitationUpdate, userUpdate]) => {
    if (invitationUpdate) {
      helper.successLog(req.originalUrl, `Updated invitation status of Invitation id ${invitationUpdate.id} to Accepted`)
    }
    if (userUpdate === 'Already Single') {
      helper.successLog(req.originalUrl, `No update to profile of User id ${userUpdate.id} who is already a Single`)
    } else if (userUpdate) {
      helper.successLog(req.originalUrl, `Updated profile of User id ${userUpdate.id}`)
    }
    return res.json({})
  }).catch((e) => {
    if (e.name === 'InvalidUserIdError' || e.name === 'InvalidInvitationIdError' || e.name === 'UsedInvitationError') {
      helper.errorLog(req.originalUrl, e)
      return res.status(400).send({ message: e.clientMsg })
    } else {
      helper.errorLog(req.originalUrl, e)
      return res.status(500).send({ message: SERVER_ERROR_MSG })
    }
  })
})

router.post('/:id/reject', function (req, res) {
  const invitationId = req.params.id
  models.Invitations.findById(
    invitationId
  ).then(invitation => {
    if (!invitation) {
      return Promise.reject(new CustomError('InvalidInvitationIdError', `Invalid Invitation id ${invitationId}`, 'Invalid Invitation id'))
    }
    if (invitation.status !== 'P') {
      return Promise.reject(new CustomError('UsedInvitationError', `There is already a response given for Invitation id ${invitationId}`, 'Invalid Invitation id'))
    }
    return invitation.updateAttributes({
      status: 'N'
    })
  }).then(updatedInvitation => {
    helper.successLog(req.originalUrl, `Rejected Invitation id ${updatedInvitation.id}`)
    return res.json({})
  }).catch((e) => {
    if (e.name === 'InvalidInvitationIdError' || e.name === 'UsedInvitationError') {
      helper.errorLog(req.originalUrl, e)
      return res.status(400).send({ message: e.clientMsg })
    } else {
      helper.errorLog(req.originalUrl, e)
      return res.status(500).send({ message: SERVER_ERROR_MSG })
    }
  })
})

module.exports = router
