import { content, Lang } from '@/lib/content'
import { ShieldCheck } from 'lucide-react'

interface SederhanaProps { lang: Lang }

export default function Sederhana({ lang }: SederhanaProps) {
  const t = content.sederhana[lang]

  return (
    <section id="sederhana" className="section-light">
      <div className="container">
        {/* Header */}
        <div style={{ maxWidth: '680px', marginBottom: 'var(--space-3xl)' }}>
          <p className="section-label">{t.label}</p>
          <h2 className="t-section-title" style={{ color: 'var(--color-navy)', marginBottom: 'var(--space-sm)' }}>
            {t.title}
          </h2>
          <p className="t-body-lg" style={{ color: 'var(--color-gray)' }}>{t.subtitle}</p>
          <div className="divider" />
        </div>

        {/* Split: text + stats */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 'var(--space-3xl)',
            marginBottom: 'var(--space-3xl)',
          }}
          className="sederhana-split"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
            <p className="t-body" style={{ color: 'var(--color-navy)' }}>{t.p1}</p>
            <p className="t-body" style={{ color: 'var(--color-gray)' }}>{t.p2}</p>
            <p className="t-body" style={{ color: 'var(--color-gray)' }}>{t.p3}</p>
            <div style={{ marginTop: 'var(--space-sm)' }}>
              <div className="badge-certified">
                <ShieldCheck size={14} />
                {t.badge}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1px',
              background: 'var(--color-sand)',
              border: '1px solid var(--color-sand)',
              alignSelf: 'start',
            }}
          >
            {t.stats.map((s, i) => (
              <div
                key={i}
                style={{
                  background: 'var(--color-white)',
                  padding: 'var(--space-lg) var(--space-md)',
                }}
              >
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 700,
                    fontSize: 'clamp(28px, 3.5vw, 44px)',
                    color: 'var(--color-black)',
                    letterSpacing: '-0.02em',
                    lineHeight: 1.1,
                  }}
                >
                  {s.number}
                </div>
                <div style={{ fontSize: '13px', color: 'var(--color-gray)', marginTop: '6px' }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Photo band placeholder */}
        <div
          style={{
            width: '100%',
            height: '360px',
            background: 'linear-gradient(90deg, #0A0A0A 0%, #6B6B6B 50%, #0A0A0A 100%)',
            opacity: 0.15,
            borderRadius: '2px',
            marginBottom: 'var(--space-3xl)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          aria-label="Sederhana food photography"
          role="img"
        >
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '22px',
              fontWeight: 600,
              color: 'var(--color-navy)',
              opacity: 0.4,
              letterSpacing: '0.05em',
            }}
          >
            {lang === 'en' ? 'Photography coming soon' : 'Foto segera hadir'}
          </span>
        </div>

        {/* Timeline */}
        <div>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontWeight: 700,
              fontSize: '11px',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--color-gray)',
              marginBottom: 'var(--space-xl)',
            }}
          >
            {lang === 'en' ? 'Brand Timeline' : 'Kronologi Merek'}
          </p>
          <div className="timeline">
            {t.timeline.map((item, i) => (
              <div key={i} className="timeline-item">
                <span className="timeline-item__date">{item.date}</span>
                <p className="timeline-item__event">{item.event}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 767px) {
          .sederhana-split { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}
