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
        style={{ background: 'rgba(0,33,86,0.85)' }}
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
          <div className="vision-pillars-grid">
            {t.pillars.map((pillar, i) => (
              <div
                key={i}
                className="vision-pillar"
              >
                <div className="vision-pillar__num">
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

      <style>{`
        .vision-pillars-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0;
        }
        .vision-pillar {
          padding: var(--space-lg);
          border-left: 1px solid rgba(255,255,255,0.1);
        }
        .vision-pillar:first-child {
          border-left: none;
        }
        .vision-pillar__num {
          font-family: var(--font-body);
          font-weight: 300;
          font-size: 72px;
          line-height: 1;
          color: rgba(255,255,255,0.07);
          letter-spacing: -0.02em;
          margin-bottom: var(--space-sm);
          user-select: none;
        }
        @media (max-width: 1023px) {
          .vision-pillars-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .vision-pillar:nth-child(1),
          .vision-pillar:nth-child(3) {
            border-left: none;
          }
          .vision-pillar:nth-child(n+3) {
            border-top: 1px solid rgba(255,255,255,0.1);
          }
        }
        @media (max-width: 767px) {
          .vision-pillars-grid {
            grid-template-columns: 1fr;
          }
          .vision-pillar {
            border-left: none;
            border-top: 1px solid rgba(255,255,255,0.1);
            padding: var(--space-lg) 0;
          }
          .vision-pillar:first-child {
            border-top: none;
          }
        }
      `}</style>
    </section>
  )
}
