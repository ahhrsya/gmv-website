import { content, Lang } from '@/lib/content'

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
          </div>

          {/* Stats */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
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
                    fontFamily: 'var(--font-body)',
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

        {/* Photo band image */}
        <div
          style={{
            width: '100%',
            aspectRatio: '16/9',
            borderRadius: '4px',
            overflow: 'hidden',
            marginBottom: 'var(--space-3xl)',
          }}
        >
          <img
            src="/assets/sederhana.png"
            alt="Restoran Sederhana"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        </div>


      </div>

      <style>{`
        @media (max-width: 1023px) {
          .sederhana-split { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}
