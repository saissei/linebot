const lineMenu = require('./initialize/addRichMenu')
const readline = require('readline-sync')

const menuAdd = async (height, items, imagePath) => {
  try {
    const addMenu = await lineMenu.addMenu(height, items)
    const richMenuId = addMenu.data.richMenuId
    const addImage = lineMenu.addImage(richMenuId, imagePath)
    if (!addImage) {
      return richMenuId
    }
  } catch (err) {
    console.error(err)
  }
}

const AssignUser = async (richMenuId, userId) => {
  try {
    const assignResult = lineMenu.assignUser(richMenuId, userId)
    if (!assignResult) {
      return '登録が成功しました'
    }
  } catch (err) {
    console.error(err)
  }
}

const AssignAllUsers = async richMenuId => {
  try {
    const assignResult = lineMenu.assignAllUsers(userId)
    if (!assignResult) {
      return '登録が成功しました'
    }
  } catch (err) {
    console.error(err)
  }
}

const height = readline.questionInt(
  '全体の高さを指定してください。 [ 1686 | 843 ] : '
)
const types = readline.question(
  'メニューの種類を入力してください。 [ message | datetimepicker | uri ] : '
)
const menuItems = [
  {
    bounds: {
      x: 0,
      y: 0,
      width: 2500,
      height: parseInt(height)
    }
  }
]

switch (types) {
  case 'message':
    const msg = readline.question(
      'メニューを押された時の入力メッセージを入力してください : '
    )
    menuItems[0].action = { type: 'message', uri: msg }
    break
  case 'datetimepicker':
    menuItems[0].action = {
      type: 'datetimepicker',
      data: 'datetime=001',
      mode: 'datetime'
    }
    break
  case 'uri':
    const uri = readline.question('リンクアドレスを入力してください : ')
    menuItems[0].action = { type: 'uri', uri: uri }
    break
  default:
    console.log('入力された種類は選択できません。')
    process.exit(1)
    break
}

const imagePath = readline.questionPath(
  '登録する画像のPATHを入力してください : '
)
const assignType = readline
  .question('ユーザー単位の紐付けですか？ [yYnN] : ')
  .toLowerCase()

switch (assignType) {
  case 'y':
    console.log('リッチメニューの登録を開始します..')
    console.log('-----------------------------------')
    menuAdd(height, menuItems, imagePath)
      .then(richMenuId => {
        assignAllUsers(richMenuId)
          .then(result => console.log(result))
          .catch(err => console.error(err))
      })
      .catch(err => console.error(err))
    break
  case 'n':
    const userId = readline.question(
      '紐付けするユーザーのIDを入力して下さい : '
    )
    menuAdd(height, menuItems, imagePath)
      .then(richMenuId => {
        assignUser(richMenuId, userId)
          .then(result => console.log(result))
          .catch(err => console.error(err))
      })
      .catch(err => console.error(err))
    break
  default:
    console.log('入力された種類は選択できません。')
    process.exit(1)
    break
}
