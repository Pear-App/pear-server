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
  }
}
