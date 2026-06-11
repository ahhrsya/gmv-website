import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

export const revalidate = 0

const CMS_DIR = path.join(process.cwd(), 'content', 'cms')

export async function POST(req: NextRequest) {
  try {
    // Optional bearer-token gate (set NEXT_PUBLIC_CMS_SECRET in Vercel)
    const expected = process.env.CMS_SECRET
    if (expected) {
      const auth = req.headers.get('authorization') ?? ''
      const token = auth.replace(/^Bearer\s+/i, '')
      if (token !== expected) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
    }

    const body = await req.json()
    const file: string = body.file ?? 'home'
    const allowed = ['home', 'about', 'contact']
    if (!allowed.includes(file)) {
      return NextResponse.json({ error: 'File not allowed' }, { status: 400 })
    }

    const en     = (body.en     && typeof body.en     === 'object') ? body.en     : {}
    const id     = (body.id     && typeof body.id     === 'object') ? body.id     : {}
    const shared = (body.shared && typeof body.shared === 'object') ? body.shared : {}

    await fs.mkdir(CMS_DIR, { recursive: true })
    const filePath = path.join(CMS_DIR, `${file}.json`)
    const data = { en, id, shared }
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8')

    return NextResponse.json({ ok: true, file, savedAt: new Date().toISOString() })
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
