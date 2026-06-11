import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

export const revalidate = 0

const CMS_DIR = path.join(process.cwd(), 'content', 'cms')

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const file = searchParams.get('file') ?? 'home'

    // Allow-list of editable files
    const allowed = ['home', 'about', 'contact']
    if (!allowed.includes(file)) {
      return NextResponse.json({ error: 'File not allowed' }, { status: 400 })
    }

    const filePath = path.join(CMS_DIR, `${file}.json`)
    let data: { en: Record<string, string>; id: Record<string, string>; shared: Record<string, string> }

    try {
      const raw = await fs.readFile(filePath, 'utf-8')
      data = JSON.parse(raw)
    } catch {
      // First-time load: seed from the section keys defined in admin
      data = {
        en:     seedFromContentMd(file, 'en'),
        id:     seedFromContentMd(file, 'id'),
        shared: {},
      }
      await fs.mkdir(CMS_DIR, { recursive: true })
      await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8')
    }

    return NextResponse.json(data)
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

function seedFromContentMd(file: string, lang: 'en' | 'id'): Record<string, string> {
  // Best-effort: if a content/<file>.md file exists, parse its YAML front-matter
  // and return the keys for the requested language. This is just a sensible
  // first-run experience — the user can then edit freely.
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const fsSync = require('fs') as typeof import('fs')
    const mdPath = path.join(process.cwd(), 'content', `${file}.md`)
    const raw = fsSync.readFileSync(mdPath, 'utf-8')
    const match = raw.match(/^---\n([\s\S]*?)\n---/)
    if (!match) return {}
    // Lightweight YAML parse: just pick `key: value` lines under the lang block
    const yaml = match[1]
    const lines = yaml.split('\n')
    let inBlock = false
    const out: Record<string, string> = {}
    for (const line of lines) {
      if (line.startsWith(`${lang}:`)) { inBlock = true; continue }
      if (inBlock && /^[a-z_]+:/i.test(line) && !line.startsWith('  ')) { inBlock = false }
      if (!inBlock) continue
      const m = line.match(/^\s{2}([a-z0-9_]+):\s*(.*)$/i)
      if (!m) continue
      let val = m[2].trim()
      // Strip surrounding quotes
      val = val.replace(/^['"]|['"]$/g, '')
      // Strip `| ` block-scalar marker
      if (val === '|') val = ''
      out[m[1]] = val
    }
    return out
  } catch {
    return {}
  }
}
