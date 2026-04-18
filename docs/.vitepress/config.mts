import { defineConfig } from 'vitepress'

import { blogTheme } from './blog-theme'

const base = '/Perseverance.github.io/'

export default defineConfig({
  extends: blogTheme,
  base,
  lang: 'zh-cn',
  title: 'Perseverance',
  description: 'Perseverance 的 CTF 学习之路',
  lastUpdated: true,
  head: [
    ['link', { rel: 'icon', href: `${base}favicon.ico` }],
    ['meta', { name: 'theme-color', content: '#0f766e' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:title', content: 'Perseverance' }],
    ['meta', { property: 'og:description', content: '记录 CTF 比赛复盘。' }]
  ],
  themeConfig: {
    outline: {
      level: [2, 3],
      label: '目录'
    },
    returnToTopLabel: '回到顶部',
    sidebarMenuLabel: '相关文章',
    lastUpdatedText: '上次更新于',
    logo: '/avatar.jpg',
    nav: [
      { text: '首页', link: '/' },
      { text: '关于', link: '/about' }
    ],
    socialLinks: [
      {
        icon: 'github',
        link: 'https://github.com/perseverancecurry/Perseverance.github.io'
      }
    ]
  }
})
