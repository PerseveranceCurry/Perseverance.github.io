import fs from 'node:fs'
import path from 'node:path'

const repoRoot = process.cwd()
const docsDir = path.join(repoRoot, 'docs')
const postsDir = path.join(docsDir, 'posts')
const publicPostsDir = path.join(docsDir, 'public', 'posts')
const typoraDir = path.join('C:', 'Users', 'perseverance', 'AppData', 'Roaming', 'Typora', 'typora-user-images')

const posts = [
  {
    title: 'SHCTF Writeup',
    slug: 'shctf-writeup',
    source: path.join('D:', '学习', '网安', 'CTF比赛', 'SHCTF', 'SHCTF Writeup.md'),
    date: '2026-02-23',
    top: 1,
    sticky: 2,
    cover: '/posts/shctf-writeup/decrypted_perfect.png',
    description: 'SHCTF 比赛复盘，包含 Web、Misc、Forensics 等方向的题解、截图与关键利用脚本。',
    tags: ['CTF', 'Writeup', 'Web', 'Misc', 'Forensics']
  },
  {
    title: '哈尔滨工业大学（威海）第四届网络安全技术挑战赛 Writeup',
    slug: 'hitwh-fourth-cybersecurity-writeup',
    source: path.join('D:', '学习', '网安', 'CTF比赛', '哈尔滨工业大学（威海）第四届网络安全技术挑战赛', '哈尔滨工业大学（威海）第四届网络安全技术挑战赛 Writeup.md'),
    date: '2026-04-10',
    top: 2,
    sticky: 1,
    cover: '/posts/hitwh-fourth-cybersecurity-writeup/%E6%8B%BC%E5%9B%BE.png',
    description: '哈尔滨工业大学（威海）第四届网络安全技术挑战赛复盘，整理 Web、Forensics 等题目的解题过程。',
    tags: ['CTF', 'Writeup', 'Web', 'Forensics', 'Campus']
  }
]

fs.mkdirSync(postsDir, { recursive: true })
fs.mkdirSync(publicPostsDir, { recursive: true })

for (const post of posts) {
  importPost(post)
}

function importPost(post) {
  const sourceDir = path.dirname(post.source)
  const sourceText = fs.readFileSync(post.source, 'utf8')
  const assetDir = path.join(publicPostsDir, post.slug)
  const assetMap = new Map()
  const usedNames = new Set()

  fs.rmSync(assetDir, { recursive: true, force: true })
  fs.mkdirSync(assetDir, { recursive: true })

  let content = sourceText.replace(/\r\n/g, '\n')
  content = content.replace(/^#\s+.+?\n+/, '')
  content = content.replace(/(<img[^>\n]+?)\s*\/!\[/g, '$1 />\n\n![')
  content = content.replace(/\/!\[/g, '\n\n![')

  content = content.replace(/<img\b([^>]*?)src=(["'])(.*?)\2([^>]*?)\/?>/gi, (_, before, __, src, after) => {
    const altMatch = `${before} ${after}`.match(/alt=(["'])(.*?)\1/i)
    const alt = altMatch?.[2] ?? path.parse(src).name
    const publicPath = ensureAsset(src, sourceDir, assetDir, assetMap, usedNames, post.slug)
    return publicPath ? `![${alt}](${publicPath})` : `![${alt}](${src})`
  })

  content = content.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (full, alt, src) => {
    const publicPath = ensureAsset(src, sourceDir, assetDir, assetMap, usedNames, post.slug)
    return publicPath ? `![${alt}](${publicPath})` : full
  })

  const frontmatter = [
    '---',
    `title: ${quote(post.title)}`,
    `date: ${post.date}`,
    `description: ${quote(post.description)}`,
    `top: ${post.top}`,
    `sticky: ${post.sticky}`,
    `cover: ${quote(post.cover)}`,
    'tag:',
    ...post.tags.map((tag) => `  - ${quote(tag)}`),
    '---',
    ''
  ].join('\n')

  fs.writeFileSync(path.join(postsDir, `${post.slug}.md`), `${frontmatter}\n${content.trim()}\n`, 'utf8')
  console.log(`Imported ${post.title}`)
}

function ensureAsset(src, sourceDir, assetDir, assetMap, usedNames, slug) {
  const normalizedSrc = src.trim().replace(/^<|>$/g, '').replace(/\\/g, '/')

  if (
    !normalizedSrc
    || /^https?:\/\//i.test(normalizedSrc)
    || normalizedSrc.startsWith('data:')
    || normalizedSrc.startsWith('/posts/')
    || normalizedSrc.startsWith('/Perseverance.github.io/')
  ) {
    return null
  }

  if (assetMap.has(normalizedSrc)) {
    return assetMap.get(normalizedSrc)
  }

  const resolved = resolveAsset(normalizedSrc, sourceDir)
  if (!resolved) {
    console.warn(`Missing asset: ${normalizedSrc}`)
    return null
  }

  const fileName = uniqueFileName(path.basename(resolved), usedNames)
  fs.copyFileSync(resolved, path.join(assetDir, fileName))

  const publicPath = `/posts/${slug}/${encodeURIComponent(fileName)}`
  assetMap.set(normalizedSrc, publicPath)
  return publicPath
}

function resolveAsset(src, sourceDir) {
  if (/^[A-Za-z]:\//.test(src)) {
    return fs.existsSync(src) ? src : null
  }

  const localResolved = path.resolve(sourceDir, src)
  if (fs.existsSync(localResolved)) {
    return localResolved
  }

  const typoraMarker = 'AppData/Roaming/Typora/typora-user-images/'
  const markerIndex = src.indexOf(typoraMarker)
  if (markerIndex !== -1) {
    const tail = src.slice(markerIndex + typoraMarker.length)
    const typoraResolved = path.join(typoraDir, tail)
    if (fs.existsSync(typoraResolved)) {
      return typoraResolved
    }
  }

  if (src.startsWith('../AppData/')) {
    const typoraResolved = path.join(typoraDir, path.basename(src))
    if (fs.existsSync(typoraResolved)) {
      return typoraResolved
    }
  }

  return null
}

function uniqueFileName(fileName, usedNames) {
  const parsed = path.parse(fileName)
  let candidate = fileName
  let index = 1

  while (usedNames.has(candidate)) {
    candidate = `${parsed.name}-${index}${parsed.ext}`
    index += 1
  }

  usedNames.add(candidate)
  return candidate
}

function quote(value) {
  return JSON.stringify(value)
}
