var express = require('express')
var bodyParser = require('body-parser')

var app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use('/api', require('./routes/index'))

const server = app.listen(3000, '127.0.0.1', function () {
  const host = server.address().address
  const port = server.address().port
  console.log('Pear listening at https://%s:%s', host, port)
})

module.exports = app
