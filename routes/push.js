var express = require('express')
var router = express.Router()
var passport = require('passport')

router.use('*', passport.authenticate(['jwt'], { session: false }), function (req, res, next) {
  next()
})

const gcm = require('node-gcm')
const sender = new gcm.Sender(process.env.PEAR_FCM_API_KEY)

router.get('/', function (req, res) {
  var message = new gcm.Message({
    data: { key1: 'msg1' }
  })
  var regTokens = ['YOUR_REG_TOKEN_HERE']
  sender.send(message, { registrationTokens: regTokens }, function (err, response) {
    if (err) console.error(err)
    else console.log(response)
  })
  res.send({})
})

module.exports = router
