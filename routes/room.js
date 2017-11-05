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

  function checkAuthAndFindRoom (userId, roomId) {
    return new Promise(function (resolve, reject) {
      models.Rooms.findOne({
        where: {
          id: roomId,
          $or: [
            { firstPersonId: userId },
            { secondPersonId: userId }
          ]
        }
      }).then(room => {
        console.log(room.id)
        if (room) {
          resolve(room) // user is a participant of the room
        } else {
          reject(new CustomError('RoomPermissionError', `User id ${userId} not participant of Room id ${roomId}`, 'Unauthorized room participant'))
        }
      })
    })
  }

  router.get('/:roomId/messages', function (req, res) {
    const roomId = req.params.roomId
    const userId = req.user.userId
    checkAuthAndFindRoom(
      userId,
      roomId
    ).then((room) => {
      return models.Messages.findAll({
        where: {
          roomId: roomId
        },
        attributes: ['id', 'ownerId', 'text', 'createdAt', 'isEvent']
      })
    }).then(messages => {
      // TODO: add owner name to messages
      helper.successLog(req.originalUrl, `user id ${userId} GET all messages in room id ${roomId}`)
      return res.json(messages)
    }).catch((e) => {
      if (e.name === 'RoomPermissionError') {
        helper.errorLog(req.originalUrl, e)
        return res.status(400).send({ message: e.clientMsg })
      } else {
        helper.errorLog(req.originalUrl, e)
        return res.status(500).send({ message: SERVER_ERROR_MSG })
      }
    })
  })

  router.post('/:roomId/messages', function (req, res) {
    const userId = req.user.userId
    const roomId = req.params.roomId
    const message = req.body.message
    models.Messages.create({
      ownerId: userId,
      text: message,
      roomId
    }).then(message => {
      if (message) {
        helper.push(models, req.app.get('gcm'), req.app.get('sender'), userId, roomId)
        helper.successLog(req.originalUrl, `user id ${userId} created a message id ${message.id} in room id ${roomId}`)
        io.to(`${roomId}`).emit('message', message)
        return res.json({})
      }
    }).catch((e) => {
      helper.errorLog(req.originalUrl, e)
      return res.status(500).send({ message: SERVER_ERROR_MSG })
    })
  })
  return router
}
