var express = require('express')
var router = express.Router()
var passport = require('passport')
var models = require('../models')
var helper = require('./helper')
var CustomError = helper.CustomError
var SERVER_ERROR_MSG = helper.SERVER_ERROR_MSG

function checkAuthAndFindRoom (userId, roomId) {
  return new Promise(function (resolve, reject) {
    models.Rooms.findOne({
      where: {
        $or: [
          { firstPersonId: userId },
          { secondPersonId: userId }
        ]
      }
    }).then(room => {
      if (room && room.id === parseInt(roomId, 10)) {
        resolve(room) // user is a participant of the room
      } else {
        reject(new CustomError('RoomPermissionError', `User id ${userId} not participant of Room id ${roomId}`, 'Unauthorized room participant'))
      }
    })
  })
}

router.get('/:roomId/messages', passport.authenticate(['jwt'], { session: false }), function (req, res) {
  const roomId = req.params.roomId
  const userId = req.user.userId
  checkAuthAndFindRoom(
    userId,
    roomId
  ).then((room) => {
    return models.Messages.findAll({
      where: {
        roomId: roomId
      }
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

module.exports = router
