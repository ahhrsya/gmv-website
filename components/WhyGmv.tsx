import { content, Lang } from '@/lib/content'
import { CheckCircle, Globe, Layers, TrendingUp, ShieldCheck } from 'lucide-react'

interface WhyGmvProps { lang: Lang }

const icons = [CheckCircle, Globe, Layers, TrendingUp, ShieldCheck]

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
            const Icon = icons[i]
            return (
              <div
                key={i}
                className={`why-card why-card-${i}`}
              >
                <Icon size={28} style={{ color: 'var(--color-white)', marginBottom: 'var(--space-md)' }} />
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
          grid-template-columns: repeat(6, 1fr);
          gap: var(--space-sm);
        }
        .why-card {
          grid-column: span 2 !important;
        }
        .why-card-3,
        .why-card-4 {
          grid-column: span 3 !important;
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
