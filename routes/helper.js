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
  push: function (models, gcm, sender, userId, roomId, message) {
    let user = null
    let otherPerson = null

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
      user = room.firstPerson.id === userId ? room.firstPerson : room.secondPerson
      otherPerson = room.firstPerson.id !== userId ? room.firstPerson : room.secondPerson

      return models.Blacklists.findOne({
        where: {
          blocker: otherPerson.id,
          blockee: user.id
        }
      })
    }).then(blacklist => {
      if (blacklist) {
        module.exports.errorLog('[PUSH]', `Failed to send push notification to User id ${otherPerson.id} as User id ${user.id} is blocked`)
        return
      }

      const body = message.isEvent ? message.text : `${user.facebookName}: ${message.text}`
      const route = `/user/${otherPerson.id}/chat/${user.id}`
      module.exports.send(gcm, sender, body, route, otherPerson)
    })
  },
  send: function (gcm, sender, body, route, otherPerson) {
    const pushNotification = new gcm.Message({
      priority: 'high',
      notification: {
        body: body,
        click_action: 'FCM_PLUGIN_ACTIVITY'
      },
      data: {
        text: body,
        route: route
      }
    })

    sender.send(pushNotification, { registrationTokens: [otherPerson.fcmToken] }, function (err, response) {
      if (err) {
        module.exports.errorLog('[PUSH]', `Failed to send push notification to User id ${otherPerson.id}: ${err}`)
      } else {
        module.exports.successLog('[PUSH]', `Sent push notification to User id ${otherPerson.id}`)
      }
    })
  },
  shuffle: function (a) {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      const tmp = a[i]
      a[i] = a[j]
      a[j] = tmp
    }
    return a
  }
}
