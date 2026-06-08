// app/api/get-content/route.ts
import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const ALLOWED = ['home', 'nav']

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const file = searchParams.get('file') ?? 'home'

  if (!ALLOWED.includes(file)) {
    return NextResponse.json({ error: 'Invalid file' }, { status: 400 })
  }

  const filePath = path.join(process.cwd(), 'content', `${file}.md`)
  if (!fs.existsSync(filePath)) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const raw = fs.readFileSync(filePath, 'utf8')
  const { data } = matter(raw)

  return NextResponse.json({
    file,
    en:     data.en     ?? {},
    id:     data.id     ?? {},
    shared: data.shared ?? {},
  })
}
