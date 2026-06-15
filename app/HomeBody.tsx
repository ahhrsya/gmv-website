'use client'

import dynamic from 'next/dynamic'
import { content } from '@/lib/content'
import { usePersistedLang } from '@/lib/usePersistedLang'
// Above-the-fold: static imports (loaded immediately)
import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import About from '@/components/About'
// Below-the-fold: dynamic imports (code-split, lazy-loaded)
const Vision    = dynamic(() => import('@/components/Vision'))
const Market    = dynamic(() => import('@/components/Market'))
const Sederhana = dynamic(() => import('@/components/Sederhana'))
const Expansion = dynamic(() => import('@/components/Expansion'))
const WhyGmv   = dynamic(() => import('@/components/WhyGmv'))
const Footprint = dynamic(() => import('@/components/Footprint'))
const Team      = dynamic(() => import('@/components/Team'))
const Press     = dynamic(() => import('@/components/Press'))
const Contact   = dynamic(() => import('@/components/Contact'))
const Footer    = dynamic(() => import('@/components/Footer'))

const s = content.sections

export default function HomeBody() {
  const [lang, setLang] = usePersistedLang()

  return (
    <>
      <Navbar lang={lang} onLangChange={setLang} />
      <main>
        <Hero lang={lang} />
        {s.about     && <About lang={lang} />}
        {s.vision    && <Vision lang={lang} />}
        {s.market    && <Market lang={lang} />}
        {s.sederhana && <Sederhana lang={lang} />}
        {s.expansion && <Expansion lang={lang} />}
        {s.whyGmv    && <WhyGmv lang={lang} />}
        {s.footprint && <Footprint lang={lang} />}
        {s.team      && <Team lang={lang} />}
        {s.press     && <Press lang={lang} />}
        {s.contact   && <Contact lang={lang} />}
      </main>
      <Footer lang={lang} />
    </>
  )
}
