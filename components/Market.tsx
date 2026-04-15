import { content, Lang } from '@/lib/content'

interface MarketProps { lang: Lang }

export default function Market({ lang }: MarketProps) {
  const t = content.market[lang]

  return (
    <section id="market" className="section-white">
      <div className="container">
        <p className="section-label">{t.label}</p>
        <div className="split">
          {/* Left: narrative */}
          <div>
            <h2 className="t-section-title" style={{ color: 'var(--color-navy)', marginBottom: 'var(--space-lg)' }}>
              {t.title}
            </h2>
            <div className="divider" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)', marginTop: 'var(--space-lg)' }}>
              <p className="t-body" style={{ color: 'var(--color-navy)' }}>{t.p1}</p>
              <p className="t-body" style={{ color: 'var(--color-gray)' }}>{t.p2}</p>
            </div>
          </div>

          {/* Right: stats grid */}
          <div className="stat-grid">
            {t.stats.map((s, i) => (
              <div key={i} className="stat-block">
                <div className="stat-block__number">{s.number}</div>
                <div className="stat-block__label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Closing full-width statement */}
        <div
          style={{
            marginTop: 'var(--space-3xl)',
            paddingTop: 'var(--space-xl)',
            borderTop: '1px solid var(--color-sand)',
          }}
        >
          <p
            className="t-subsection"
            style={{
              color: 'var(--color-navy)',
              maxWidth: '760px',
              fontStyle: 'italic',
            }}
          >
            {t.closing}
          </p>
        </div>
      </div>
    </section>
  )
}
