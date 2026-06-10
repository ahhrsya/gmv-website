// scripts/generate-articles-index.js
// Run: node scripts/generate-articles-index.js
// Reads all .md files from content/articles/ and generates:
//   public/articles-index.json     — article list for /articles page
//   public/articles/[slug].json    — individual article data

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
  if (idx < 0) return { en: body.trim(), id: '' }
  return {
    en: body.slice(0, idx).replace('[EN_CONTENT]', '').trim(),
    id: body.slice(idx + sep.length).trim()
  }
}

// Ensure output dirs exist
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true })
if (!fs.existsSync(ARTICLES_DIR)) {
  fs.mkdirSync(ARTICLES_DIR, { recursive: true })
  console.log('Created content/articles/ — add .md files here')
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
    date: meta.date || '',
    category: meta.category || 'General',
    cover_image: meta.cover_image || '',
    excerpt_en: meta.excerpt_en || en.split('\n')[0].slice(0, 160),
    excerpt_id: meta.excerpt_id || id.split('\n')[0].slice(0, 160),
    published: meta.published !== false,
    author: meta.author || 'GMV Team',
    read_time: meta.read_time || Math.max(1, Math.ceil((en.split(' ').length) / 200)),
    content_en: en,
    content_id: id,
  }
  
  // Write individual article JSON
  fs.writeFileSync(
    path.join(OUT_DIR, `${article.slug}.json`),
    JSON.stringify(article, null, 2)
  )
  
  // Add to index (without full content for performance)
  index.push({
    slug: article.slug,
    title_en: article.title_en,
    title_id: article.title_id,
    date: article.date,
    category: article.category,
    cover_image: article.cover_image,
    excerpt_en: article.excerpt_en,
    excerpt_id: article.excerpt_id,
    published: article.published,
    author: article.author,
    read_time: article.read_time,
  })
  
  console.log(`✓ ${article.slug}`)
})

// Sort by date descending
index.sort((a, b) => new Date(b.date) - new Date(a.date))

fs.writeFileSync(INDEX_OUT, JSON.stringify(index, null, 2))
console.log(`\n✓ Generated ${index.length} articles → public/articles-index.json`)
