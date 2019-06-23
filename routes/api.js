require('dotenv').config()
const express = require('express')
const axios = require('axios')
const router = express.Router()
const moment = require('moment')
const qs = require('qs')
const line = require('../lib/line')
const geo = require('../lib/geocoding')
const wth = require('../lib/wether')
function sleep(time) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve()
    }, time)
  })
}

/* GET home page. */
router.get('/', (req, res, next) => {
  res
    .status(200)
    .header(header)
    .json({ status: 'success' })
})

router.post('/webhook', async (req, res, next) => {
  res.status(200).end()

  try {
    const receiveData = req.body.events
    let message = receiveData.filter(item => {
      return item.type === 'message'
    })
    if (message[0].message.type === 'text') {
      axios
        .post('http://localhost:3000/textMessage', message)
        .then(result => console.log(result.data))
        .catch(err => console.error(err.response.data))
    } else if (message[0].message.type === 'location') {
      console.log({
        latitude: message[0].message.latitude,
        longitude: message[0].message.longitude
      })
      const weather = await axios.get('http://localhost:3000/weather', {
        params: {
          latitude: message[0].message.latitude,
          longitude: message[0].message.longitude
        },
        paramsSerializer: params => {
          return qs.stringify(params)
        }
      })
    }
  } catch (err) {
    console.log(err)
  }
})

router.post('/textMessage', (req, res, next) => {
  res.status(200).end()

  const message = req.body
  message.map(item => {
    const searchType = item.message.text
    const replyToken = item.replyToken

    switch (searchType) {
      case '明日の天気':
        const actLocation = {
          items: [
            {
              type: 'action',
              action: {
                type: 'location',
                label: '地図をから選択'
              }
            }
          ]
        }
        line
          .sendQuickMessage(
            replyToken,
            '調べたい場所を教えてください',
            actLocation
          )
          .then(result => console.log(result.data))
          .catch(err => console.error(err.response.data))
        break
    }
  })
})

router.get('/weather', async (req, res, next) => {
  try {
    const geoIp = qs.parse(req.query)
    const weather = await wth.describe(geoIp.latitude, geoIp.longitude)
    let wetherProperty = weather.data.list.filter(list => {
      return moment.unix(list.dt).format('HH') === '09'
    })
    wetherProperty = wetherProperty.map(list => ({
      date: moment.unix(list.dt).format('YYYYMMDD'),
      temp_min: Math.floor(parseFloat(list.main.temp_min) - 273.15),
      temp_max: Math.floor(parseFloat(list.main.temp_max) - 273.15),
      humidity: list.main.humidity,
      pressure: list.main.pressure,
      weatherDesc: wth.wetherDescription(list.weather[0].icon)
    }))
    console.log(wetherProperty)
    res.status(200).json({ weekly: wetherProperty })
  } catch (err) {
    console.error(err)
    res.status(400).json('error happened')
  }
})

module.exports = router
