module.exports = {
  successLog: function (source, msg) {
    var date = new Date().toLocaleString('en-US', {timeZone: 'Asia/Singapore'})
    console.log('\n[' + date + '][' + source + '][SUCCESS] ' + msg + '\n')
  },
  errorLog: function (source, msg) {
    var date = new Date().toLocaleString('en-US', {timeZone: 'Asia/Singapore'})
    console.log('\n[' + date + '][' + source + '][ERROR] ' + msg + '\n')
  }
}
