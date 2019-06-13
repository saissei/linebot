require('dotenv').config()
const axios = require('axios')
const moment = require('moment')
const qs = require('querystring')
//const url = 'https://map.yahooapis.jp/weather/V1/place'
const url = 'https://api.openweathermap.org/data/2.5/forecast'

exports.describe = async (latitude, longitude) => {
  /*
  const params = {
    appid: process.env.Y_clientId,
    coordinates: `${latitude},${longitude}`,
    past: 1,
    output: 'json'
  }
  */
  const params = {
    lat: latitude,
    lon: longitude,
    appid: process.env.openWeather_key
  }
  const uri = `${url}?${qs.stringify(params)}`
  console.log(uri)
  return await axios.get(uri)
}

exports.wetherDescription = wetherCode => {
  let weatherDesc
  switch (wetherCode) {
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
  return weatherDesc
}
