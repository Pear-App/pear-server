const express = require('express')
const router = express.Router()
const base64url = require('base64url')
const crypto = require('crypto')
const helper = require('./helper')
const CustomError = helper.CustomError

function parse (signedRequest) {
  var encodedData = signedRequest.split('.')
  var sig = encodedData[0]
  var data = JSON.parse(base64url.decode(encodedData[1]))

  if (!data.algorithm || data.algorithm.toUpperCase() != 'HMAC-SHA256') {
    return Promise.reject(new CustomError('UnknownAlgorithmError', 'Expected HMAC-SHA256', ''))
  }

  var expectedSig = crypto.createHmac('sha256', process.env.PEAR_FB_CLIENT_SECRET).update(encodedData[1]).digest('base64').replace(/\+/g,'-').replace(/\//g,'_').replace('=','')
  if (sig !== expectedSig) {
    return Promise.reject(new CustomError('BadJSONSigError', 'Bad JSON signature', ''))
  }

  return Promise.resolve(data['user_id'])
}

router.post('/', function (req, res) {
  parse(req.body.signed_request).then(userId => {
    // TODO
    console.log(userId)
    helper.successLog(req.originalUrl, '')
    return res.send({})
  }).catch((e) => {
    if (e.name === 'UnknownAlgorithmError' || e.name === 'BadJSONSigError') {
      helper.errorLog(req.originalUrl, e)
      return res.status(400).send({})
    } else {
      helper.errorLog(req.originalUrl, e)
      return res.status(500).send({})
    }
  })
})

module.exports = router
