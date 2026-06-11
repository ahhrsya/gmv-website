'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, ArrowRight } from 'lucide-react'
import { content, Lang } from '@/lib/content'

interface NavbarProps {
  lang: Lang
  onLangChange: (lang: Lang) => void
}

const NAV_LINKS = {
  en: [
    { label: 'Home',     href: '/' },
    { label: 'About',    href: '/about' },
    { label: 'Articles', href: '/articles' },
  ],
  id: [
    { label: 'Beranda',  href: '/' },
    { label: 'Tentang',  href: '/about' },
    { label: 'Artikel',  href: '/articles' },
  ],
}

export default function Navbar({ lang, onLangChange }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()
  const links = NAV_LINKS[lang]

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  return (
    <>
      <nav
        style={{
          position: 'fixed',
          top: 0, left: 0, right: 0,
          zIndex: 'var(--z-nav)' as any,
          padding: '0 var(--space-lg)',
          height: '64px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          transition: 'background 0.35s ease, backdrop-filter 0.35s ease, box-shadow 0.35s ease',
          background: scrolled ? 'rgba(0,33,86,0.92)' : 'transparent',
          backdropFilter: scrolled ? 'blur(12px)' : 'none',
          boxShadow: scrolled ? '0 1px 0 rgba(255,255,255,0.06)' : 'none',
        }}
      >
        {/* Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center' }}>
          <img
            src={(content as any).nav_logo_src || '/assets/logo.svg'}
            alt="Global Minang Ventura"
            style={{ height: '100px', width: 'auto', display: 'block' }}
          />
        </Link>

        {/* Desktop nav links — absolutely centered so right-section width changes don't shift them */}
        <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', display: 'flex', alignItems: 'center', gap: 'var(--space-xl)' }} className="desktop-nav">
          {links.map(link => (
            <Link
              key={link.href}
              href={link.href}
              style={{
                fontFamily: 'var(--font-body)',
                fontWeight: isActive(link.href) ? 700 : 500,
                fontSize: '13px',
                color: isActive(link.href) ? '#fff' : 'rgba(255,255,255,0.65)',
                transition: 'color 0.2s',
                textDecoration: 'none',
                letterSpacing: '0.01em',
                position: 'relative',
              }}
              onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
              onMouseLeave={e => (e.currentTarget.style.color = isActive(link.href) ? '#fff' : 'rgba(255,255,255,0.65)')}
            >
              {link.label}
              {isActive(link.href) && (
                <span style={{
                  position: 'absolute', bottom: '-4px', left: 0, right: 0,
                  height: '1px', background: 'rgba(255,255,255,0.5)',
                }} />
              )}
            </Link>
          ))}
        </div>

        {/* Right: lang toggle + CTA + hamburger */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }} className="desktop-nav">
          {/* Language toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '2px', background: 'rgba(255,255,255,0.08)', borderRadius: '999px', padding: '3px' }}>
            {(['en', 'id'] as Lang[]).map(l => (
              <button
                key={l}
                onClick={() => onLangChange(l)}
                style={{
                  padding: '5px 12px', borderRadius: '999px', fontSize: '12px', fontWeight: 700,
                  letterSpacing: '0.06em', textTransform: 'uppercase', cursor: 'pointer',
                  transition: 'all 0.2s',
                  background: lang === l ? 'var(--color-white)' : 'transparent',
                  color: lang === l ? 'var(--color-navy)' : 'rgba(255,255,255,0.6)',
                  border: 'none',
                }}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>

          {/* CTA */}
          <Link href="/contact" style={{ textDecoration: 'none' }}>
            <button
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                background: 'var(--color-white)', color: 'var(--color-black)',
                fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '13px',
                padding: '10px 22px', borderRadius: '999px', cursor: 'pointer',
                transition: 'all 0.25s var(--ease-out)', border: 'none',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-bone)'; e.currentTarget.style.transform = 'scale(1.02)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'var(--color-white)'; e.currentTarget.style.transform = 'scale(1)' }}
            >
              {content.hero[lang].ctaPrimary}
              <ArrowRight size={14} />
            </button>
          </Link>

          {/* Hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            style={{ display: 'none', color: 'var(--color-white)', background: 'none' }}
            className="mobile-menu-btn"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{
          position: 'fixed', top: '64px', left: 0, right: 0,
          background: 'rgba(0,33,86,0.97)', backdropFilter: 'blur(16px)',
          zIndex: 49, padding: 'var(--space-lg)',
          borderTop: '1px solid rgba(255,255,255,0.08)',
        }}>
          {links.map(link => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              style={{
                display: 'block', padding: 'var(--space-md) 0',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
                fontFamily: 'var(--font-body)', fontWeight: isActive(link.href) ? 700 : 500,
                fontSize: '15px',
                color: isActive(link.href) ? '#fff' : 'rgba(255,255,255,0.7)',
                textDecoration: 'none',
              }}
            >
              {link.label}
            </Link>
          ))}
          <div style={{ display: 'flex', gap: '8px', marginTop: 'var(--space-lg)' }}>
            {(['en', 'id'] as Lang[]).map(l => (
              <button
                key={l}
                onClick={() => { onLangChange(l); setMenuOpen(false) }}
                style={{
                  padding: '8px 16px', borderRadius: '999px', fontSize: '13px', fontWeight: 700,
                  letterSpacing: '0.06em', textTransform: 'uppercase', cursor: 'pointer',
                  background: lang === l ? 'var(--color-white)' : 'rgba(255,255,255,0.1)',
                  color: lang === l ? 'var(--color-navy)' : 'rgba(255,255,255,0.7)',
                  border: 'none',
                }}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </>
  )
}
