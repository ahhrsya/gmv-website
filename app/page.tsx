'use client'

import { useState } from 'react'
import { Lang } from '@/lib/content'
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

export default function Home() {
  const [lang, setLang] = useState<Lang>('en')

  return (
    <>
      <Navbar lang={lang} onLangChange={setLang} />
      <main>
        <Hero lang={lang} />
        <About lang={lang} />
        <Vision lang={lang} />
        <Market lang={lang} />
        <Sederhana lang={lang} />
        <Expansion lang={lang} />
        <WhyGmv lang={lang} />
        <Footprint lang={lang} />
        {/* <Team lang={lang} /> */}
        <Press lang={lang} />
        <Contact lang={lang} />
      </main>
      <Footer lang={lang} />
    </>
  )
}
