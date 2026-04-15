'use client'

import { useState, useEffect } from 'react'
import { Menu, X, ArrowRight } from 'lucide-react'
import { content, Lang } from '@/lib/content'

interface NavbarProps {
  lang: Lang
  onLangChange: (lang: Lang) => void
}

export default function Navbar({ lang, onLangChange }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const t = content.nav

  const navIds = ['about', 'vision', 'market', 'sederhana', 'expansion', 'why-gmv', 'footprint', 'team', 'press', 'contact']

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollTo = (id: string) => {
    setMenuOpen(false)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <nav
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 'var(--z-nav)' as any,
          padding: '0 var(--space-lg)',
          height: '64px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          transition: 'background 0.35s ease, backdrop-filter 0.35s ease, box-shadow 0.35s ease',
          background: scrolled ? 'rgba(10,10,10,0.92)' : 'transparent',
          backdropFilter: scrolled ? 'blur(12px)' : 'none',
          boxShadow: scrolled ? '0 1px 0 rgba(255,255,255,0.06)' : 'none',
        }}
      >
        {/* Logo */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          style={{
            fontFamily: 'var(--font-body)',
            fontWeight: 600,
            fontSize: '15px',
            color: 'var(--color-white)',
            letterSpacing: '0.01em',
            cursor: 'pointer',
          }}
        >
          <span className="desktop-logo">Global Minang Ventura</span>
          <span className="mobile-logo">GMV</span>
        </button>

        {/* Desktop nav links */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-lg)',
          }}
          className="desktop-nav"
        >
          {t[lang].map((item, i) => (
            <button
              key={i}
              onClick={() => scrollTo(navIds[i])}
              style={{
                fontFamily: 'var(--font-body)',
                fontWeight: 500,
                fontSize: '13px',
                color: 'rgba(255,255,255,0.75)',
                cursor: 'pointer',
                transition: 'color 0.2s',
                background: 'none',
              }}
              onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.75)')}
            >
              {item}
            </button>
          ))}
        </div>

        {/* Right: lang toggle + CTA */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
          <div className="lang-toggle desktop-nav">
            <button
              className={`lang-toggle__btn ${lang === 'en' ? 'active' : ''}`}
              onClick={() => onLangChange('en')}
            >
              EN
            </button>
            <button
              className={`lang-toggle__btn ${lang === 'id' ? 'active' : ''}`}
              onClick={() => onLangChange('id')}
            >
              ID
            </button>
          </div>
          <button
            onClick={() => scrollTo('contact')}
            className="btn-primary desktop-nav"
            style={{ fontSize: '13px', padding: '10px 20px' }}
          >
            {lang === 'en' ? 'Join the Journey' : 'Bergabung'} <ArrowRight size={14} />
          </button>
          {/* Hamburger */}
          <button
            className="mobile-nav"
            onClick={() => setMenuOpen(true)}
            style={{ color: 'var(--color-white)', cursor: 'pointer', display: 'flex' }}
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>
        </div>
      </nav>

      {/* Mobile overlay */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 200,
          background: 'var(--color-navy)',
          display: 'flex',
          flexDirection: 'column',
          padding: 'var(--space-lg)',
          transform: menuOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-3xl)' }}>
          <span style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '15px', color: 'var(--color-white)' }}>GMV</span>
          <button onClick={() => setMenuOpen(false)} style={{ color: 'var(--color-white)', cursor: 'pointer', display: 'flex' }} aria-label="Close menu">
            <X size={22} />
          </button>
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
          {t[lang].map((item, i) => (
            <button
              key={i}
              onClick={() => scrollTo(navIds[i])}
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 600,
                fontSize: '26px',
                color: 'var(--color-white)',
                textAlign: 'left',
                cursor: 'pointer',
                padding: 'var(--space-xs) 0',
                borderBottom: '1px solid rgba(255,255,255,0.07)',
                transition: 'color 0.2s',
              }}
            >
              {item}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)', marginTop: 'var(--space-xl)' }}>
          <div className="lang-toggle" style={{ alignSelf: 'flex-start' }}>
            <button className={`lang-toggle__btn ${lang === 'en' ? 'active' : ''}`} onClick={() => onLangChange('en')}>EN</button>
            <button className={`lang-toggle__btn ${lang === 'id' ? 'active' : ''}`} onClick={() => onLangChange('id')}>ID</button>
          </div>
          <button
            onClick={() => scrollTo('contact')}
            className="btn-primary"
            style={{ alignSelf: 'flex-start' }}
          >
            {lang === 'en' ? 'Join the Journey' : 'Bergabung'} <ArrowRight size={14} />
          </button>
        </div>
      </div>

      <style>{`
        .desktop-logo { display: inline; }
        .mobile-logo { display: none; }
        .desktop-nav { display: flex !important; }
        .mobile-nav { display: none !important; }
        @media (max-width: 1023px) {
          .desktop-nav { display: none !important; }
          .mobile-nav { display: flex !important; }
          .desktop-logo { display: none; }
          .mobile-logo { display: inline; }
        }
      `}</style>
    </>
  )
}
