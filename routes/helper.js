module.exports = {
  SERVER_ERROR_MSG: 'An error occurred with processing your request',
  CustomError: function (errorName, serverMsg, clientMsg) {
    var e = new Error(serverMsg)
    e.name = errorName
    e.clientMsg = clientMsg
    return e
  },
  errorLog: function (source, msg) {
    var date = new Date().toLocaleString('en-US', {timeZone: 'Asia/Singapore'})
    console.log('\n[' + date + '][' + source + '][ERROR] ' + msg + '\n')
  },
  successLog: function (source, msg) {
    var date = new Date().toLocaleString('en-US', {timeZone: 'Asia/Singapore'})
    console.log('\n[' + date + '][' + source + '][SUCCESS] ' + msg + '\n')
  },
  checkAge: function (...ages) {
    return new Promise(function (resolve, reject) {
      var fn = function (age) { return age >= 18 }
      ages = ages.filter(function (n) { return n !== undefined })
      if (ages.every(fn)) {
        resolve()
      } else {
        reject(new module.exports.CustomError('InvalidAge', 'Invalid age', 'Invalid age'))
      }
    })
  },
  checkAgeRange: function (minAge, maxAge) {
    return new Promise(function (resolve, reject) {
      if (minAge && maxAge && minAge <= maxAge) {
        resolve()
      } else {
        reject(new module.exports.CustomError('InvalidAgeRange', 'Invalid age range', 'Invalid age range'))
      }
    })
  },
  getPhotoId: function (photo) {
    return photo.photoId
  },
  push: function (models, gcm, sender, userId, roomId) {
    models.Rooms.findOne({
      where: { id: roomId },
      attributes: [],
      include: [
        {
          model: models.Users,
          as: 'firstPerson',
          attributes: ['id', 'facebookName', 'fcmToken']
        },
        {
          model: models.Users,
          as: 'secondPerson',
          attributes: ['id', 'facebookName', 'fcmToken']
        }
      ]
    }).then(room => {
      const user = room.firstPerson.id === userId ? room.firstPerson : room.secondPerson
      const otherPerson = room.firstPerson.id !== userId ? room.firstPerson : room.secondPerson

      const body = `New message from ${user.facebookName}`
      const route = `/user/${otherPerson.id}/chat/${user.id}`
      const tag = 'message'

      const message = new gcm.Message({
        priority: 'high',
        notification: {
          body: body,
          tag: tag,
          click_action: 'FCM_PLUGIN_ACTIVITY'
        },
        data: {
          text: body,
          route: route
        }
      })

      sender.send(message, { registrationTokens: [otherPerson.fcmToken] }, function (err, response) {
        if (err) {
          module.exports.errorLog('[PUSH]', `Failed to send push notification to User id ${otherPerson.id}: ${err}`)
        } else {
          module.exports.successLog('[PUSH]', `Sent push notification to User id ${otherPerson.id}`)
        }
      })
    })
  }
}
