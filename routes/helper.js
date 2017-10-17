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
  }
}
