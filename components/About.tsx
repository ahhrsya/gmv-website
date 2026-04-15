import { content, Lang } from '@/lib/content'
import { ShieldCheck } from 'lucide-react'

interface AboutProps { lang: Lang }

export default function About({ lang }: AboutProps) {
  const t = content.about[lang]

  return (
    <section id="about" className="section-light">
      {/* Trust bar */}
      <div className="trust-bar">
        <div className="trust-bar__inner">
          <span className="trust-bar__label">
            {lang === 'en' ? 'Certified by' : 'Tersertifikasi oleh'}
          </span>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-xs)',
              color: 'var(--color-black)',
            }}
          >
            <ShieldCheck size={18} />
            <span
              style={{
                fontFamily: 'var(--font-body)',
                fontWeight: 600,
                fontSize: '14px',
                letterSpacing: '0.04em',
              }}
            >
              Restoran Sederhana
            </span>
          </div>
          <span
            style={{
              width: '1px',
              height: '20px',
              background: 'var(--color-sand)',
              display: 'block',
            }}
          />
          <span className="trust-bar__label">
            {lang === 'en' ? 'Official Brand License' : 'Lisensi Merek Resmi'}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="container" style={{ paddingTop: 'var(--space-3xl)' }}>
        <div className="split">
          {/* Left */}
          <div>
            <p className="section-label">{t.label}</p>
            <h2 className="t-section-title" style={{ color: 'var(--color-navy)' }}>
              {t.title}
            </h2>
            <div className="divider" />
            <div className="badge-certified" style={{ marginTop: 'var(--space-xl)' }}>
              <ShieldCheck size={14} />
              {t.badge}
            </div>
          </div>

          {/* Right */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
            <p className="t-body-lg" style={{ color: 'var(--color-navy)' }}>{t.p1}</p>
            <p className="t-body" style={{ color: 'var(--color-gray)' }}>{t.p2}</p>
            <p className="t-body" style={{ color: 'var(--color-gray)' }}>{t.p3}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
