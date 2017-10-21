var express = require('express')
var router = express.Router()

router.use('/authenticate', require('./authenticate'))
router.use('/deauthenticate', require('./deauthenticate'))
router.use('/user', require('./user'))
router.use('/invitation', require('./invitation'))
router.use('/match', require('./match'))

module.exports = router
