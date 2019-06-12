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
