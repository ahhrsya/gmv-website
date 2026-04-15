import { content, Lang } from '@/lib/content'

interface VisionProps { lang: Lang }

export default function Vision({ lang }: VisionProps) {
  const t = content.vision[lang]

  return (
    <section
      id="vision"
      className="section-photo bg-vision-placeholder songket-overlay"
      aria-label="Vision and Mission section"
    >
      <div
        className="section-photo__overlay"
        style={{ background: 'rgba(10,10,10,0.85)' }}
      />
      <div className="section-photo__content container">
        {/* Vision block */}
        <div
          style={{
            textAlign: 'center',
            maxWidth: '760px',
            margin: '0 auto',
            marginBottom: 'var(--space-4xl)',
          }}
        >
          <p className="section-label section-label--light">{t.label}</p>
          <h2 className="t-section-title" style={{ color: 'var(--color-white)', marginBottom: 'var(--space-xl)' }}>
            {t.title}
          </h2>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontWeight: 700,
              fontSize: '11px',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.5)',
              marginBottom: 'var(--space-md)',
            }}
          >
            {t.visionLabel}
          </p>
          <p
            className="t-body-lg"
            style={{ color: 'rgba(255,255,255,0.80)', fontStyle: 'italic', lineHeight: 1.75 }}
          >
            {t.visionText}
          </p>
        </div>

        {/* Mission pillars */}
        <div>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontWeight: 700,
              fontSize: '11px',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.5)',
              textAlign: 'center',
              marginBottom: 'var(--space-2xl)',
            }}
          >
            {t.missionLabel}
          </p>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 0,
            }}
          >
            {t.pillars.map((pillar, i) => (
              <div
                key={i}
                style={{
                  padding: 'var(--space-lg)',
                  borderLeft: i > 0 ? '1px solid rgba(255,255,255,0.1)' : 'none',
                }}
              >
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 300,
                    fontSize: '72px',
                    lineHeight: 1,
                    color: 'rgba(255,255,255,0.07)',
                    letterSpacing: '-0.02em',
                    marginBottom: 'var(--space-sm)',
                    userSelect: 'none',
                  }}
                >
                  0{i + 1}
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontWeight: 600,
                    fontSize: '18px',
                    color: 'var(--color-white)',
                    marginBottom: 'var(--space-xs)',
                  }}
                >
                  {pillar.title}
                </div>
                <div
                  style={{
                    fontSize: '14px',
                    lineHeight: 1.65,
                    color: 'rgba(255,255,255,0.55)',
                  }}
                >
                  {pillar.body}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
