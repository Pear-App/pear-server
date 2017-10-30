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

var server = app.listen(3000, function () {
  var port = server.address().port
  console.log(`Pear API Server listening at port ${port}`)
})

const io = require('socket.io')(server)

io.on('connect', function (socket) {
  socket.on('subscribe', (roomIds) => {
    roomIds.forEach((roomId) => {
      socket.join(roomId)
    })
  })
  socket.on('unsubscribe', (roomIds) => {
    roomIds.forEach((roomId) => {
      socket.leave(roomId)
    })
  })
})

app.use('/api', require('./routes/index')(io))

module.exports = app
