'use client'

import { useState } from 'react'
import Link from 'next/link'
import { content, Lang } from '@/lib/content'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Contact from '@/components/Contact'

function Breadcrumb({ lang }: { lang: Lang }) {
  return (
    <div style={{ background: 'var(--color-black)', paddingTop: '80px', paddingBottom: 'var(--space-md)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="container">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Link href="/" style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', textDecoration: 'none' }}
            onMouseEnter={e=>(e.currentTarget.style.color='rgba(255,255,255,0.7)')}
            onMouseLeave={e=>(e.currentTarget.style.color='rgba(255,255,255,0.35)')}
          >{lang==='en'?'Home':'Beranda'}</Link>
          <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '12px' }}>›</span>
          <span style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.7)' }}>
            {lang==='en'?'Contact':'Kontak'}
          </span>
        </div>
      </div>
    </div>
  )
}

export default function ContactPage() {
  const [lang, setLang] = useState<Lang>('en')
  return (
    <>
      <Navbar lang={lang} onLangChange={setLang} />
      <main>
        <Breadcrumb lang={lang} />
        <Contact lang={lang} />
      </main>
      <Footer lang={lang} />
    </>
  )
}
