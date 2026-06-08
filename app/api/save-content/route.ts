// app/api/save-content/route.ts
//
// Env vars required (set in Vercel dashboard):
//   GITHUB_PAT             — Personal Access Token (repo write scope)
//   GITHUB_OWNER           — e.g. "ahhrsya"
//   GITHUB_REPO            — e.g. "gmv-website"
//   GITHUB_BRANCH          — e.g. "main"
//   CMS_SECRET             — secret token for auth
//   NEXT_PUBLIC_CMS_SECRET — same value (used by browser panel)

import { NextRequest, NextResponse } from 'next/server'

const GITHUB_API = 'https://api.github.com'
const ALLOWED = ['home', 'nav']

interface SavePayload {
  file: string
  en:     Record<string, string>
  id:     Record<string, string>
  shared: Record<string, string | number>
}

// Serialize a flat Record to YAML lines, indented by 2 spaces
function toYamlBlock(
  data: Record<string, string | number>,
  indent = '  '
): string {
  return Object.entries(data)
    .map(([key, value]) => {
      const v = String(value)
      if (v.includes('\n')) {
        // block scalar
        const lines = v.split('\n').map(l => `${indent}  ${l}`).join('\n')
        return `${indent}${key}: |\n${lines}`
      }
      const needsQuote = /[:#\[\]{}&*!|>'"%@`,]/.test(v)
        || v.startsWith(' ') || v.endsWith(' ') || v === ''
      if (needsQuote) {
        return `${indent}${key}: "${v.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`
      }
      return `${indent}${key}: ${v}`
    })
    .join('\n')
}

export async function POST(req: NextRequest) {
  // Auth
  const token = (req.headers.get('authorization') ?? '').replace('Bearer ', '')
  if (token !== process.env.CMS_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let payload: SavePayload
  try {
    payload = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { file, en, id, shared } = payload
  if (!file || !ALLOWED.includes(file)) {
    return NextResponse.json({ error: 'Invalid file' }, { status: 400 })
  }

  // Build .md content with nested en/id/shared blocks
  const sections: string[] = ['---']

  if (Object.keys(en).length) {
    sections.push('en:')
    sections.push(toYamlBlock(en))
  }
  if (Object.keys(id).length) {
    sections.push('id:')
    sections.push(toYamlBlock(id))
  }
  if (Object.keys(shared).length) {
    sections.push('shared:')
    sections.push(toYamlBlock(shared))
  }

  sections.push('---\n')
  const mdContent = sections.join('\n')

  // Get current SHA from GitHub
  const { GITHUB_PAT, GITHUB_OWNER, GITHUB_REPO, GITHUB_BRANCH } = process.env
  const filePath = `content/${file}.md`
  const apiUrl = `${GITHUB_API}/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${filePath}`

  const getRes = await fetch(apiUrl, {
    headers: {
      Authorization: `Bearer ${GITHUB_PAT}`,
      Accept: 'application/vnd.github+json',
    },
  })

  let sha: string | undefined
  if (getRes.ok) {
    sha = (await getRes.json()).sha
  }

  // Commit
  const body: Record<string, unknown> = {
    message: `cms: update ${file}.md`,
    content: Buffer.from(mdContent, 'utf8').toString('base64'),
    branch:  GITHUB_BRANCH ?? 'main',
  }
  if (sha) body.sha = sha

  const putRes = await fetch(apiUrl, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${GITHUB_PAT}`,
      Accept: 'application/vnd.github+json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  if (!putRes.ok) {
    const err = await putRes.text()
    return NextResponse.json({ error: 'GitHub commit failed', detail: err }, { status: 500 })
  }

  return NextResponse.json({ ok: true, file, committed: `${file}.md` })
}
