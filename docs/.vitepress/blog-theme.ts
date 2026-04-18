import { getThemeConfig } from '@sugarat/theme/node'

const blogTheme = getThemeConfig({
  footer: {
    message: 'Built with VitePress and @sugarat/theme',
    copyright: 'MIT License | Perseverance'
  },
  themeColor: 'el-blue',
  author: 'Perseverance',
  home: {
    logo: '/avatar.jpg',
    hoverSpin: false
  },
  popover: {
    title: '欢迎来到本站',
    body: [
      {
        type: 'text',
        content: '这里主要记录 CTF 比赛复盘'
      },
      {
        type: 'button',
        content: '查看仓库',
        link: 'https://github.com/perseverancecurry/Perseverance.github.io'
      },
      {
        type: 'button',
        content: '主题参考',
        props: {
          type: 'success'
        },
        link: 'https://theme.sugarat.top/'
      }
    ],
    duration: 0
  }
})

export { blogTheme }
