require('dotenv').config()
const express = require('express')
const router = express.Router()
const moment = require('moment')
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
      wetherProperty = wetherProperty.map(list => {
        const date = moment.unix(list.dt).format('MM月DD日の天気')
        const temp_min = Math.floor(list.main.temp_min - 273.15)
        const temp_max = Math.floor(list.main.temp_max - 273.15)
        const humidity = list.main.humidity
        const pressure = list.main.pressure
        const weatherDesc = wth.wetherDescription(list.weather[0].icon)

        return (message = `${date}\nてんき: ${weatherDesc}\nさいていきおん: ${temp_min} ℃\nさいこうきおん: ${temp_max} ℃\nしつど: ${humidity} %\n気圧: ${pressure} hPa`)
      })
      for (let i = 0; i < wetherProperty.length; i++) {
        console.log(`Number: ${i}`)
        console.log(`Token: ${replyToken}`)
        console.log(`Message: ${wetherProperty[i]}`)
        await line
          .sendMessage(replyToken, wetherProperty[i])
          .then(result => console.log(result.data))
          .catch(err => console.error(err.response.data))
        await sleep(1000)
      }
    } catch (err) {
      console.error(err)
    }
  })
})

module.exports = router
