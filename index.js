var express = require('express')
var bodyParser = require('body-parser')
var cors = require('cors')

var app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors({ origin: true }))

/* START Authentication Configuration START */
const passport = require('passport')
const passportJwt = require('passport-jwt')
app.use(passport.initialize())

const passportJWTOptions = {
  jwtFromRequest: passportJwt.ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.PEAR_JWT_SIGNING_KEY,
  issuer: 'api.pear.me',
  audience: 'pear.me'
}

passport.use(new passportJwt.Strategy(passportJWTOptions, (jwtPayload, done) => {
  const user = JSON.parse(jwtPayload.sub).user
  return done(null, user)
}))
/* END Authentication Configuration END */

app.use('/api', require('./routes/index'))

if (process.env.NODE_ENV === 'production') {
  var server = app.listen(3000, function () {
    var host = server.address().address
    var port = server.address().port
    console.log('Pear listening at https://%s:%s', host, port)
  })
} else {
  var devServer = app.listen(3000, '127.0.0.1', function () {
    var host = devServer.address().address
    var port = devServer.address().port
    console.log('Pear listening at https://%s:%s', host, port)
  })
}

module.exports = app
