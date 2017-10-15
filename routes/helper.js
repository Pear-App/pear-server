module.exports = {
  successLog: function (source, msg) {
    var date = new Date().toLocaleString('en-US', {timeZone: 'Asia/Singapore'})
    console.log('\n[' + date + '][' + source + '][SUCCESS] ' + msg + '\n')
  },
  errorLog: function (source, msg) {
    var date = new Date().toLocaleString('en-US', {timeZone: 'Asia/Singapore'})
    console.log('\n[' + date + '][' + source + '][ERROR] ' + msg + '\n')
  },
  getUser: function (models, facebookId) {
    return new Promise(function (resolve, reject) {
      models.Users.findOne({
        where: { facebookId: facebookId }
      }).then(user => {
        if (user) {
          resolve(user)
        } else {
          reject(new Error('User w facebookId=' + facebookId + ' is not found'))
        }
      })
    })
  }
}
