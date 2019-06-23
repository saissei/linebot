require('dotenv').config()
const axios = require('axios')

exports.addMenu = async (height, items) => {
  const uri = 'https://api.line.me/v2/bot/richmenu'
  const header = {
    'Content-Type': 'application/json; charset=UTF-8',
    Authorization: `Bearer ${process.env.access_token}`
  }
  const menuTemplate = {
    size: {
      width: 2500,
      height: height
    },
    selected: true,
    name: 'richmenu',
    chatBarText: 'メニュー',
    areas: []
  }
  menuTemplate.areas.push(...items)
  return await axios.post(uri, menuTemplate, { headers: header })
}

exports.addImage = async (menuId, image) => {
  const uri = `https://api.line.me/v2/bot/richmenu/${menuId}/content`

  const header = {
    'Content-Type': 'image/png',
    Authorization: `Bearer ${process.env.access_token}`
  }
  //const imageTobase = new Buffer.from(image, 'binary').toString('base64')
  return await axios.post(uri, image, { headers: header })
}

exports.assignUser = async (userId, contentId) => {
  const uri = `https://api.line.me/v2/bot/user/${userId}/richmenu/c${contentId}`
  const header = {
    Authorization: `Bearer ${process.env.access_token}`
  }
  return await axios.post(uri, '', { headers: header })
}

exports.assignAllUsers = async contentId => {
  const uri = `https://api.line.me/v2/bot/user/all/richmenu/${contentId}`
  const header = {
    Authorization: `Bearer ${process.env.access_token}`
  }
  return await axios.post(uri, '', { headers: header })
}

const menuItem = [
  {
    bounds: {
      x: 0,
      y: 0,
      width: 2500,
      height: 843
    },
    action: {
      type: 'message',
      text: '明日の天気'
    }
  }
]

const contentId = 'richmenu-b0c3b5d519c98c496591332669d8bf80'
const usrId = 'Ue8b17afd74f6ae7ee2ef9b7d37d9cc6c'
/*
addMenu(843, menuItem)
  .then(result => console.log(result.data))
  .catch(err => console.error(err))
*/

/*
const fs = require('fs')
const img = fs.readFileSync('./img/richmenu.png')
addImage(contentId, img)
  .then(result => console.log(result.data))
  .catch(err => console.error(err))
*/

/*
assignAllUsers(contentId)
  .then(result => console.log(result.data))
  .catch(err => console.error(err.response.data))
*/
