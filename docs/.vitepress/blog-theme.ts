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
  friend: [
    {
      nickname: 'GitHub',
      des: '源码仓库与 Pages 发布源',
      avatar: 'https://github.githubassets.com/favicons/favicon.svg',
      url: 'https://github.com/perseverancecurry/Perseverance.github.io'
    },
    {
      nickname: 'Theme Sugarat',
      des: '站点主题参考来源',
      avatar: 'https://theme.sugarat.top/logo.png',
      url: 'https://theme.sugarat.top/'
    }
  ],
  popover: {
    title: '欢迎来到本站',
    body: [
      {
        type: 'text',
        content: '这里主要记录 CTF 比赛复盘、Web 安全题解和取证过程。'
      },
      {
        type: 'text',
        content: '首批已发布 SHCTF 与哈工大（威海）网络安全技术挑战赛 Writeup。'
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
