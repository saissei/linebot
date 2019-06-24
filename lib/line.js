require('dotenv').config()
const axios = require('axios')
const crypto = require('crypto')
const uri = 'https://api.line.me/v2/bot/message/reply'
const signature = crypto.createHmac('sha256', process.env.ch_secret)
const bearerToken = `Bearer ${process.env.access_token}`
const header = {
  'Content-Type': 'application/json; charset=UTF-8',
  SIGNATURE: signature,
  Authorization: `Bearer ${process.env.access_token}`
}

exports.validate_signature = (signature, body) => {
  return (
    signature ==
    crypto
      .createHmac('sha256', process.env.ch_secret)
      .update(Buffer.alloc(JSON.stringify(body), 'utf8'))
      .digest('base64')
  )
}

exports.sendMessage = async (token, body) => {
  const data = {
    replyToken: token,
    messages: [
      {
        type: 'text',
        text: body
      }
    ]
  }
  return await axios.post(uri, data, { headers: header })
}

exports.sendQuickMessage = async (token, body, actionMenu) => {
  const data = {
    replyToken: token,
    messages: [
      {
        type: 'text',
        text: body,
        quickReply: actionMenu
      }
    ]
  }
  return await axios.post(uri, data, { headers: header })
}

exports.sendTemplateMessage = async (token, text, actionMenu) => {
  const data = {
    replyToken: token,
    messages: [
      {
        type: 'template',
        altText: text,
        template: {
          type: 'buttons',
          title: text,
          text: 'Please select',
          actions: actionMenu
        }
      }
    ]
  }
  return axios.post(uri, data, { headers: header })
}

exports.sendFlexMessage = async (token, actionMenu) => {
  const data = {
    replyToken: token,
    messages: [
      {
        type: 'flex',
        altText: '#',
        contents: actionMenu
      }
    ]
  }
  return axios.post(uri, data, { headers: header })
}
