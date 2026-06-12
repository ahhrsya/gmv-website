'use client'

import { content } from '@/lib/content'
import { usePersistedLang } from '@/lib/usePersistedLang'
import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import About from '@/components/About'
import Vision from '@/components/Vision'
import Market from '@/components/Market'
import Sederhana from '@/components/Sederhana'
import Expansion from '@/components/Expansion'
import WhyGmv from '@/components/WhyGmv'
import Footprint from '@/components/Footprint'
import Team from '@/components/Team'
import Press from '@/components/Press'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'

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
