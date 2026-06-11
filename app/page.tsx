import { promises as fs } from 'fs'
import path from 'path'
import HomeClient from '@/components/HomeClient'

export const dynamic = 'force-static'

type CmsFile = { sections: Record<string, { en?: Record<string, string>; id?: Record<string, string>; shared?: Record<string, string> }> }

async function loadCms() {
  try {
    const raw = await fs.readFile(path.join(process.cwd(), 'content', 'cms', 'home.json'), 'utf-8')
    return JSON.parse(raw) as CmsFile
  } catch {
    return null
  }
}

export default async function Home() {
  const cms = await loadCms()
  return <HomeClient overrides={cms?.sections ?? null} />
}
