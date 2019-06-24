const moment = require('moment')

exports.parseToMapping = item => {
  return {
    type: 'bubble',
    styles: {
      footer: {
        separator: true
      }
    },
    body: {
      type: 'box',
      layout: 'vertical',
      contents: [
        {
          type: 'text',
          text: moment(item.date).format('YYYY年 M月 DD日のお天気'),
          weight: 'bold',
          color: '#1DB446',
          size: 'sm'
        },
        {
          type: 'text',
          text: item.weatherDesc,
          weight: 'bold',
          size: 'xxl',
          margin: 'md'
        },
        {
          type: 'separator',
          margin: 'xxl'
        },
        {
          type: 'box',
          layout: 'vertical',
          margin: 'xxl',
          spacing: 'sm',
          contents: [
            {
              type: 'box',
              layout: 'horizontal',
              contents: [
                {
                  type: 'text',
                  text: '最低気温',
                  size: 'sm',
                  color: '#555555',
                  flex: 0
                },
                {
                  type: 'text',
                  text: `${item.temp_min} ℃`,
                  size: 'sm',
                  color: '#111111',
                  align: 'end'
                }
              ]
            },
            {
              type: 'box',
              layout: 'horizontal',
              contents: [
                {
                  type: 'text',
                  text: '最高気温',
                  size: 'sm',
                  color: '#555555',
                  flex: 0
                },
                {
                  type: 'text',
                  text: `${item.temp_max} ℃`,
                  size: 'sm',
                  color: '#111111',
                  align: 'end'
                }
              ]
            },
            {
              type: 'box',
              layout: 'horizontal',
              contents: [
                {
                  type: 'text',
                  text: '湿度',
                  size: 'sm',
                  color: '#555555',
                  flex: 0
                },
                {
                  type: 'text',
                  text: `${item.humidity} %`,
                  size: 'sm',
                  color: '#111111',
                  align: 'end'
                }
              ]
            },
            {
              type: 'box',
              layout: 'horizontal',
              contents: [
                {
                  type: 'text',
                  text: '気圧',
                  size: 'sm',
                  color: '#555555',
                  flex: 0
                },
                {
                  type: 'text',
                  text: `${item.pressure} hPa`,
                  size: 'sm',
                  color: '#111111',
                  align: 'end'
                }
              ]
            }
          ]
        }
      ]
    }
  }
}
