require('dotenv').config()
const axios = require('axios')
const qs = require('querystring')
const parser = require('xml2json')
const geoUri = 'https://www.geocoding.jp/api'

exports.getGeo = async address => {
  /*const params = {
    address: address,
    sensor: false,
    key: process.env.google_apiKey
  }*/
  const params = {
    q: address
  }
  const uri = `${geoUri}?${qs.stringify(params)}`
  const beforeParse = await axios.get(uri)
  const geoData = JSON.parse(parser.toJson(beforeParse.data))
  /** geoIp responce
     * { version: '1.2',
          address: 'search Address',
          coordinate:{
            lat: 'latitude',
            lng: 'longitude',
            lat_dms: 'latitude ip',
            lng_dms: 'longitude ip'
          },
          open_location_code: '8Q7XMQ52+6J',
          url: 'request url',
          needs_to_verify: 'yes',
          google_maps: 'search Address'
        }
  */
  return geoData.result
}
