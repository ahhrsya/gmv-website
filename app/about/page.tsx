'use client'

import { useState } from 'react'
import Link from 'next/link'
import { content, Lang } from '@/lib/content'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import aboutContentJson from '@/public/about-content.json'

interface AboutContent {
  hero_title: string
  hero_subtitle: string
  about_label: string
  about_title: string
  about_p1: string
  about_p2: string
  about_badge: string
  cta_title: string
  cta_body: string
  cta_button: string
}

function Breadcrumb({ lang }: { lang: Lang }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: 'var(--space-xl)' }}>
      <Link href="/" style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', textDecoration: 'none' }}
        onMouseEnter={e=>(e.currentTarget.style.color='rgba(255,255,255,0.7)')}
        onMouseLeave={e=>(e.currentTarget.style.color='rgba(255,255,255,0.35)')}
      >{lang==='en'?'Home':'Beranda'}</Link>
      <span style={{ color: 'rgba(255,255,255,0.2)' }}>›</span>
      <span style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.7)' }}>
        {lang==='en'?'About':'Tentang'}
      </span>
    </div>
  )
}

export default function AboutPage() {
  const [lang, setLang] = useState<Lang>('en')
  const v = content.vision[lang]
  const w = content.whyGmv[lang]
  const t = (aboutContentJson as Record<string, AboutContent>)[lang]

  return (
    <>
      <Navbar lang={lang} onLangChange={setLang} />
      <main>

        {/* HERO */}
        <section style={{ minHeight: '52vh', display: 'flex', alignItems: 'flex-end', background: 'var(--color-black)', paddingTop: '80px', paddingBottom: 'var(--space-3xl)', position: 'relative' }}>
          <div style={{ position: 'absolute', inset: 0, backgroundImage: `url('/assets/map.png')`, backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.1 }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,33,86,0.98) 0%, rgba(0,33,86,0.65) 100%)' }} />
          <div className="container" style={{ position: 'relative', zIndex: 2 }}>
            <Breadcrumb lang={lang} />
            <h1 className="t-hero" style={{ color: 'var(--color-white)', maxWidth: '700px' }}>
              {t?.hero_title || (lang==='en'?'We Scale Heritage.':'Kami Mengembangkan Warisan.')}
            </h1>
            <p className="t-body-lg" style={{ color: 'rgba(255,255,255,0.55)', marginTop: 'var(--space-lg)', maxWidth: '520px' }}>
              {t?.hero_subtitle}
            </p>
          </div>
        </section>

        {/* WHO WE ARE */}
        <section className="section-light">
          <div className="container" style={{ paddingTop: 'var(--space-3xl)' }}>
            <div className="split">
              <div>
                <p className="section-label">{t?.about_label}</p>
                <h2 className="t-section-title" style={{ color: 'var(--color-navy)' }}>{t?.about_title}</h2>
                <div className="divider" />
                {t?.about_badge && (
                  <div style={{ display: 'inline-flex', marginTop: 'var(--space-lg)', padding: '8px 16px', background: 'var(--color-navy)', borderRadius: '2px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.8)' }}>{t.about_badge}</span>
                  </div>
                )}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
                <p className="t-body-lg" style={{ color: 'var(--color-navy)' }}>{t?.about_p1}</p>
                <p className="t-body" style={{ color: 'var(--color-gray)' }}>{t?.about_p2}</p>
              </div>
            </div>
          </div>
        </section>

        {/* VISION */}
        <section className="section-dark">
          <div className="container">
            <div style={{ maxWidth: '640px', marginBottom: 'var(--space-3xl)' }}>
              <p className="section-label" style={{ color: 'rgba(255,255,255,0.4)' }}>{v.label}</p>
              <h2 className="t-section-title" style={{ color: 'var(--color-white)' }}>{v.title}</h2>
              <div className="divider" style={{ background: 'rgba(255,255,255,0.2)' }} />
            </div>
            <div style={{ borderLeft: '2px solid rgba(255,255,255,0.12)', paddingLeft: 'var(--space-xl)', marginBottom: 'var(--space-3xl)' }}>
              <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: 'var(--space-sm)' }}>{v.visionLabel}</p>
              <p className="t-subsection" style={{ color: 'var(--color-white)', fontStyle: 'italic', lineHeight: 1.4 }}>"{v.visionText}"</p>
            </div>
            <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: 'var(--space-xl)' }}>{v.missionLabel}</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', borderTop: '1px solid rgba(255,255,255,0.06)' }} className="pillars-grid">
              {v.pillars.map((p,i) => (
                <div key={i} style={{ padding: 'var(--space-xl) var(--space-lg)', borderRight: i<v.pillars.length-1?'1px solid rgba(255,255,255,0.06)':'none' }}>
                  <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', marginBottom: 'var(--space-md)' }}>0{i+1}</div>
                  <h3 className="t-body-lg" style={{ color: 'var(--color-white)', marginBottom: 'var(--space-sm)', fontWeight: 600 }}>{p.title}</h3>
                  <p className="t-body" style={{ color: 'rgba(255,255,255,0.45)' }}>{p.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* WHY GMV */}
        <section className="section-white">
          <div className="container">
            <div style={{ maxWidth: '560px', marginBottom: 'var(--space-3xl)' }}>
              <p className="section-label">{w.label}</p>
              <h2 className="t-section-title" style={{ color: 'var(--color-navy)' }}>{w.title}</h2>
              <div className="divider" />
              <p className="t-body" style={{ color: 'var(--color-gray)', marginTop: 'var(--space-md)' }}>{w.subtitle}</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', borderTop: '1px solid var(--color-mist)' }} className="why-grid">
              {w.points.map((point,i) => (
                <div key={i} style={{ padding: 'var(--space-xl) var(--space-lg)', borderBottom: i<3?'1px solid var(--color-mist)':'none', borderRight: (i+1)%3!==0?'1px solid var(--color-mist)':'none' }}>
                  <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-silver)', marginBottom: 'var(--space-md)' }}>0{i+1}</div>
                  <h3 className="t-body-lg" style={{ color: 'var(--color-navy)', marginBottom: 'var(--space-sm)', fontWeight: 600 }}>{point.title}</h3>
                  <p className="t-body" style={{ color: 'var(--color-gray)' }}>{point.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section style={{ background: 'var(--color-navy)', padding: 'var(--space-3xl) 0' }}>
          <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-lg)' }}>
            <div>
              <h3 className="t-subsection" style={{ color: 'var(--color-white)', marginBottom: 'var(--space-xs)' }}>{t?.cta_title}</h3>
              <p className="t-body" style={{ color: 'rgba(255,255,255,0.5)' }}>{t?.cta_body}</p>
            </div>
            <Link href="/contact"><button className="btn-primary">{t?.cta_button} →</button></Link>
          </div>
        </section>
      </main>
      <Footer lang={lang} />
      <style>{`
        @media(max-width:768px){
          .split{grid-template-columns:1fr!important}
          .pillars-grid{grid-template-columns:1fr 1fr!important}
          .why-grid{grid-template-columns:1fr!important}
        }
      `}</style>
    </>
  )
}
