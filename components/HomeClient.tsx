'use client'

import { useEffect } from 'react'
import { content } from '@/lib/content'
import HomeBody from '@/app/HomeBody'

type SectionOverrides = { en?: Record<string, string>; id?: Record<string, string>; shared?: Record<string, string> }
type Overrides = Record<string, SectionOverrides> | null

function applyOverrides(overrides: Overrides) {
  if (!overrides) return
  for (const section of Object.keys(overrides)) {
    const o = overrides[section] ?? {}
    const target = (content.en as any)[section]
    const targetId = (content.id as any)[section]
    if (target) Object.assign(target, o.en ?? {}, o.shared ?? {})
    if (targetId) Object.assign(targetId, o.id ?? {}, o.shared ?? {})
  }
}

export default function HomeClient({ overrides }: { overrides: Overrides }) {
  useEffect(() => {
    applyOverrides(overrides)
  }, [overrides])
  return <HomeBody />
}
