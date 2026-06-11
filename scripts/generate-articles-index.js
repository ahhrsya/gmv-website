// scripts/generate-articles-index.js
const fs = require('fs')
const path = require('path')

const ARTICLES_DIR = path.join(process.cwd(), 'content', 'articles')
const OUT_DIR = path.join(process.cwd(), 'public', 'articles')
const INDEX_OUT = path.join(process.cwd(), 'public', 'articles-index.json')

function parseFrontmatter(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  if (!match) return { meta: {}, content: raw }
  const lines = match[1].split('\n')
  const meta = {}
  lines.forEach(line => {
    const kv = line.match(/^([a-zA-Z_0-9]+):\s*(.*)/)
    if (kv) {
      let val = kv[2].trim()
      if (val === 'true') val = true
      else if (val === 'false') val = false
      else if (!isNaN(val) && val !== '') val = Number(val)
      else if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1,-1)
      meta[kv[1]] = val
    }
  })
  const body = raw.slice(match[0].length).trim()
  return { meta, content: body }
}

function parseContent(body) {
  const sep = '[ID_CONTENT]'
  const idx = body.indexOf(sep)
  if (idx < 0) return { en: body.replace('[EN_CONTENT]', '').trim(), id: '' }
  return {
    en: body.slice(0, idx).replace('[EN_CONTENT]', '').trim(),
    id: body.slice(idx + sep.length).trim()
  }
}

if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true })
if (!fs.existsSync(ARTICLES_DIR)) {
  fs.mkdirSync(ARTICLES_DIR, { recursive: true })
  console.log('Created content/articles/')
  fs.writeFileSync(INDEX_OUT, '[]')
  process.exit(0)
}

const files = fs.readdirSync(ARTICLES_DIR).filter(f => f.endsWith('.md'))
const index = []

files.forEach(file => {
  const raw = fs.readFileSync(path.join(ARTICLES_DIR, file), 'utf-8')
  const { meta, content } = parseFrontmatter(raw)
  const { en, id } = parseContent(content)

  const article = {
    slug: meta.slug || file.replace('.md', ''),
    title_en: meta.title_en || '',
    title_id: meta.title_id || '',
    date: String(meta.date || ''),
    category: meta.category || 'General',
    cover_image: meta.cover_image || '',
    show_image: meta.show_image !== false,
    excerpt_en: meta.excerpt_en || en.split('\n')[0].slice(0, 160),
    excerpt_id: meta.excerpt_id || id.split('\n')[0].slice(0, 160),
    published: meta.published !== false,
    author: meta.author || 'GMV Team',
    read_time: meta.read_time || Math.max(1, Math.ceil(en.split(' ').length / 200)),
    content_en: en,
    content_id: id,
  }

  fs.writeFileSync(
    path.join(OUT_DIR, `${article.slug}.json`),
    JSON.stringify(article, null, 2)
  )

  index.push({ ...article })
  delete index[index.length-1].content_en
  delete index[index.length-1].content_id

  console.log(`\u2713 ${article.slug}`)
})

index.sort((a, b) => new Date(b.date) - new Date(a.date))
fs.writeFileSync(INDEX_OUT, JSON.stringify(index, null, 2))
console.log(`\n\u2713 Generated ${index.length} articles \u2192 public/articles-index.json`)

// ── Generate about-content.json ─────────────────────────────────
const aboutMd = path.join(process.cwd(), 'content', 'about.md')
if (fs.existsSync(aboutMd)) {
  const raw = fs.readFileSync(aboutMd, 'utf-8')
  const { meta: _, content: body } = parseFrontmatter(raw)
  // Simple block parser for about.md
  const blocks = {}; let block = null
  raw.replace(/^---[\s\S]*?---/, '').split('\n').forEach(line => {
    const bm = line.match(/^(en|id|shared):\s*$/)
    if (bm) { block = bm[1]; blocks[block] = {}; return }
    if (!block) return
    const kv = line.match(/^  ([a-zA-Z0-9_]+):\s*"?(.*?)"?\s*$/)
    if (kv) blocks[block][kv[1]] = kv[2]
  })
  fs.writeFileSync(path.join(process.cwd(), 'public', 'about-content.json'), JSON.stringify(blocks, null, 2))
  console.log('\u2713 Generated public/about-content.json')
}

// ── Generate contact-content.json ───────────────────────────────
const contactMd = path.join(process.cwd(), 'content', 'contact.md')
if (fs.existsSync(contactMd)) {
  const blocks = {}; let block = null
  fs.readFileSync(contactMd, 'utf-8').replace(/^---[\s\S]*?---/, '').split('\n').forEach(line => {
    const bm = line.match(/^(en|id|shared):\s*$/)
    if (bm) { block = bm[1]; blocks[block] = {}; return }
    if (!block) return
    const kv = line.match(/^  ([a-zA-Z0-9_]+):\s*"?(.*?)"?\s*$/)
    if (kv) blocks[block][kv[1]] = kv[2]
  })
  fs.writeFileSync(path.join(process.cwd(), 'public', 'contact-content.json'), JSON.stringify(blocks, null, 2))
  console.log('\u2713 Generated public/contact-content.json')
}
