var express = require('express')
var router = express.Router()

router.use('/user', require('./user'))
router.use('/authenticate', require('./authenticate'))

router.get('/', function (req, res) {
  res.send(req.originalUrl)
})

module.exports = router
