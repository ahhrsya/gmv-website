import { content, Lang } from '@/lib/content'
// icons removed — using index numbers

interface WhyGmvProps { lang: Lang }



export default function WhyGmv({ lang }: WhyGmvProps) {
  const t = content.whyGmv[lang]

  return (
    <section id="why-gmv" className="section-dark">
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: 'var(--space-3xl)', maxWidth: '640px' }}>
          <p className="section-label">{t.label}</p>
          <h2 className="t-section-title" style={{ color: 'var(--color-white)', marginBottom: 'var(--space-sm)' }}>
            {t.title}
          </h2>
          <div className="divider" />
          <p className="t-body" style={{ color: 'rgba(255,255,255,0.5)', marginTop: 'var(--space-md)' }}>
            {t.subtitle}
          </p>
        </div>

        {/* Cards */}
        <div className="why-cards-grid">
          {t.points.map((point, i) => {
            return (
              <div
                key={i}
                className={`why-card why-card-${i}`}
              >
                <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', color: 'rgba(255,255,255,0.3)', marginBottom: 'var(--space-md)', fontFamily: 'var(--font-mono)' }}>0{i + 1}</div>
                <div className="why-card__title">{point.title}</div>
                <p className="why-card__body">{point.body}</p>
              </div>
            )
          })}
        </div>
      </div>

      <style>{`
        .why-cards-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0;
        }
        .why-card {
          border-bottom: 1px solid rgba(255,255,255,0.06);
          border-right: 1px solid rgba(255,255,255,0.06);
          padding: var(--space-xl) var(--space-lg);
        }
        .why-card:nth-child(3n) {
          border-right: none;
        }
        .why-card-3,
        .why-card-4 {
          grid-column: span 1 !important;
        }

        @media (max-width: 1023px) {
          .why-cards-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .why-card {
            grid-column: span 1 !important;
          }
          .why-card-3 {
            grid-column-start: auto !important;
          }
          .why-card-4 {
            grid-column: span 2 !important;
          }
        }

        @media (max-width: 767px) {
          .why-cards-grid {
            grid-template-columns: 1fr !important;
          }
          .why-card {
            grid-column: span 1 !important;
          }
          .why-card-3 {
            grid-column-start: auto !important;
          }
          .why-card-4 {
            grid-column: span 1 !important;
          }
        }
      `}</style>
    </section>
  )
}
