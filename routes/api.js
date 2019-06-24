require('dotenv').config()
const express = require('express')
const axios = require('axios')
const router = express.Router()
const moment = require('moment')
const qs = require('qs')
const tempFlexSimple = require('../template/flex-bubble.json')
const tempFlexCarousel = require('../template/flex-carousel.json')
const line = require('../lib/line')
const parse = require('../lib/message-parse')
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
      return (item.type === 'message') | (item.type === 'postback')
    })

    if (message[0].type && message[0].type === 'postback') {
      const receive = qs.parse(message[0].postback.data)
      const weather = await axios.get(
        `http://localhost:3000/weather/${receive.action}`,
        {
          params: {
            latitude: receive.latitude,
            longitude: receive.longitude
          },
          paramsSerializer: params => {
            return qs.stringify(params)
          }
        }
      )
      if (receive.action === 'tomorrow') {
        const tomorrowWeather = parse.parseToMapping(weather.data)
        line.sendFlexMessage(message[0].replyToken, tomorrowWeather)
      } else if (receive.action === 'weekly') {
        const weeklyWeather = weather.data.weekly.map(item => {
          return parse.parseToMapping(item)
        })
        tempFlexCarousel.contents.push(...weeklyWeather)
        line
          .sendFlexMessage(message[0].replyToken, tempFlexCarousel)
          .catch(err => console.error(err.response.data))
      }
    } else if (message[0].message.type === 'text') {
      axios
        .post('http://localhost:3000/textMessage', message)
        .then(result => console.log(result.data))
        .catch(err => console.error(err.response.data))
    } else if (message[0].message.type === 'location') {
      const locale = {
        gio: {
          latitude: message[0].message.latitude,
          longitude: message[0].message.longitude
        },
        token: message[0].replyToken
      }
      axios
        .post('http://localhost:3000/setDate', locale)
        .then(result => console.log(result.data))
        .catch(err => console.error(err))
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

router.post('/setDate', (req, res, next) => {
  res.status(200).end()
  const locale = req.body.gio
  const replyToken = req.body.token
  const actPostback = [
    {
      type: 'postback',
      label: '明日の天気',
      data: `action=tomorrow&selectId=1&${qs.stringify(locale)}`
    },
    {
      type: 'postback',
      label: '一週間の天気',
      data: `action=weekly&selectId=2&${qs.stringify(locale)}`
    }
  ]

  line
    .sendTemplateMessage(
      replyToken,
      '取得する日付を選択してくだい',
      actPostback
    )
    .then(result => console.log(result.data))
    .catch(err => console.error(err.response.data))
})

router.get('/weather/:when', async (req, res, next) => {
  const When = req.params.when
  try {
    const geoIp = qs.parse(req.query)
    const weather = await wth.describe(geoIp.latitude, geoIp.longitude)
    let weatherProperty = weather.data.list.filter(list => {
      return moment.unix(list.dt).format('HH') === '09'
    })
    weatherProperty = weatherProperty.map(list => ({
      date: moment.unix(list.dt).format('YYYYMMDD'),
      temp_min: Math.floor(parseFloat(list.main.temp_min) - 273.15),
      temp_max: Math.floor(parseFloat(list.main.temp_max) - 273.15),
      humidity: list.main.humidity,
      pressure: list.main.pressure,
      weatherDesc: wth.wetherDescription(list.weather[0].icon)
    }))
    switch (When) {
      case 'tomorrow':
        const filterDate = moment()
          .add(1, 'days')
          .format('YYYYMMDD')
        const returnData = weatherProperty.filter(item => {
          return item.date === filterDate
        })
        res.status(200).json(...returnData)
        break
      case 'weekly':
        res.status(200).json({ weekly: weatherProperty })
        console.log(weatherProperty)
        break
    }
  } catch (err) {
    console.error(err)
    res.status(400).json('error happened')
  }
  /*try {
    const geoIp = qs.parse(req.query)
    const weather = await wth.describe(geoIp.latitude, geoIp.longitude)
    let weatherProperty = weather.data.list.filter(list => {
      return moment.unix(list.dt).format('HH') === '09'
    })
    weatherProperty = weatherProperty.map(list => ({
      date: moment.unix(list.dt).format('YYYYMMDD'),
      temp_min: Math.floor(parseFloat(list.main.temp_min) - 273.15),
      temp_max: Math.floor(parseFloat(list.main.temp_max) - 273.15),
      humidity: list.main.humidity,
      pressure: list.main.pressure,
      weatherDesc: wth.wetherDescription(list.weather[0].icon)
    }))
    console.log(weatherProperty)
    res.status(200).json({ weekly: weatherProperty })
  } catch (err) {
    console.error(err)
    res.status(400).json('error happened')
  }*/
})

module.exports = router
