'use client'

import { ArrowRight, ChevronDown } from 'lucide-react'
import { content, Lang } from '@/lib/content'

interface HeroProps { lang: Lang }

export default function Hero({ lang }: HeroProps) {
  const t = content.hero[lang]

  const scrollToAbout = () => {
    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })
  }

  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
  }

  const scrollToVision = () => {
    document.getElementById('vision')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section
      className="section-photo"
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0A0A0A',
      }}
      aria-label="Hero section"
    >
      {/* Background video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: 0,
        }}
      >
        <source src="/heroanimate.mp4" type="video/mp4" />
      </video>

      {/* Readability overlay — stronger than the previous diagonal so copy stays legible over motion */}
      <div
        className="section-photo__overlay"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(10,10,10,0.65) 0%, rgba(10,10,10,0.82) 70%, rgba(10,10,10,0.90) 100%)',
          zIndex: 1,
        }}
      />

      <div
        className="section-photo__content container"
        style={{ paddingTop: '80px', textAlign: 'center' }}
      >
        <div style={{ maxWidth: '820px', margin: '0 auto' }}>
          {/* Label */}
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontWeight: 700,
              fontSize: '11px',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.6)',
              marginBottom: 'var(--space-lg)',
            }}
          >
            {t.label}
          </p>

          {/* Headline */}
          <h1
            className="t-hero"
            style={{
              color: 'var(--color-white)',
              whiteSpace: 'pre-line',
              marginBottom: 'var(--space-xl)',
            }}
          >
            {t.headline}
          </h1>

          {/* Divider */}
          <div
            className="divider"
            style={{ marginBottom: 'var(--space-xl)', marginLeft: 'auto', marginRight: 'auto' }}
          />

          {/* Subheadline */}
          <p
            className="t-body-lg"
            style={{
              color: 'rgba(255,255,255,0.82)',
              maxWidth: '560px',
              margin: '0 auto var(--space-2xl)',
            }}
          >
            {t.subheadline}
          </p>

          {/* CTAs */}
          <div
            style={{
              display: 'flex',
              gap: 'var(--space-md)',
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}
          >
            <button className="btn-primary" onClick={scrollToContact}>
              {t.ctaPrimary} <ArrowRight size={15} />
            </button>
            <button className="btn-secondary" onClick={scrollToVision}>
              {t.ctaSecondary}
            </button>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <button
        onClick={scrollToAbout}
        aria-label="Scroll down"
        style={{
          position: 'absolute',
          bottom: '40px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '6px',
          color: 'rgba(255,255,255,0.5)',
          cursor: 'pointer',
          zIndex: 10,
        }}
      >
        <span style={{ fontSize: '11px', fontFamily: 'var(--font-body)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          {lang === 'en' ? 'Scroll to discover' : 'Gulir untuk melihat'}
        </span>
        <ChevronDown size={18} style={{ animation: 'bounce 2s infinite' }} />
      </button>

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(6px); }
        }
      `}</style>
    </section>
  )
}
