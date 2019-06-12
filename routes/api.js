require('dotenv').config()
const express = require('express')
const router = express.Router()
const moment = require('moment')
const line = require('../lib/line')
const geo = require('../lib/geocoding')
const wth = require('../lib/wether')

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
    return item.type === 'message'
  })
  message.map(async item => {
    const searchAddress = item.message.text
    const replyToken = item.replyToken
    try {
      const geoIp = await geo.getGeo(searchAddress)
      const weather = await wth.describe(
        geoIp.coordinate.lat,
        geoIp.coordinate.lng
      )
      let wetherProperty = weather.data.list.filter(list => {
        console.log(moment.unix(list.dt).format('YYYY-MM-DD HH:mm:ss'))
        return moment.unix(list.dt).format('HH') === '09'
      })
      wetherProperty.map(async list => {
        const date = moment.unix(list.dt).format('MM月DD日の天気')
        const temp_min = list.main.temp_min - 273.15
        const temp_max = list.main.temp_max - 273.15
        const humidity = list.main.humidity
        const pressure = list.main.pressure
        let weatherDesc
        switch (list.weather[0].icon) {
          case '01d':
            weatherDesc = '快晴'
            break
          case '02d':
            weatherDesc = '晴れ'
            break
          case '03d':
          case '04d':
            weatherDesc = 'くもり'
            break
          case '09d':
            weatherDesc = '小雨'
            break
          case '10d':
            weatherDesc = '雨'
            break
          case '11d':
            weatherDesc = '雷雨'
            break
          case '13d':
            weatherDesc = '雪'
            break
          case '50d':
            weatherDesc = '霧'
            break
        }
        const message = `${date}\nてんき: ${weatherDesc}\nさいていきおん: ${temp_min}℃\nさいこうきおん: ${temp_max}℃\nしつど: ${humidity}%\n気圧: ${pressure}hPa`

        await line
          .sendMessage(replyToken, message)
          .then(result => console.log('success'))
          .catch(err => console.error(err))
      })

      /*await line
        .sendMessage(replyToken, wetherProperty)
        .then(result => console.log(result.data))
        .catch(err => console.error(err))
      */
    } catch (err) {
      console.error(err)
    }
  })
})

module.exports = router
