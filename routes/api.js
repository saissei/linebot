require('dotenv').config()
const express = require('express')
const router = express.Router()
const axios = require('axios')
const crypto = require('crypto')
const uri = 'https://api.line.me/v2/bot/message/reply'
const signature = crypto.createHmac('sha256', process.env.ch_secret)
const bearerToken = 'Bearer ' + process.env.access_token
const header = {
  'Content-Type': 'application/json; charset=UTF-8',
  'X-Line-Signature': signature,
  Authorization: bearerToken
}

/* GET home page. */
router.get('/', (req, res, next) => {
  res
    .status(200)
    .header(header)
    .json({ status: 'success' })
})

router.post('/webhook', (req, res, next) => {
  res.status(200).end()
  const receiveData = req.body.events
  let message = receiveData.filter(item => {
    if (item.type === 'message') return item
  })
  message.map(async item => {
    const data = {
      replyToken: item.replyToken,
      messages: [
        {
          type: 'text',
          text: item.message.text
        }
      ]
    }
    console.log(header)
    console.log(data)
    await axios
      .post(uri, data, { headers: header })
      .then(result => console.log(result))
      .catch(err => console.error(err))
  })
})

module.exports = router
