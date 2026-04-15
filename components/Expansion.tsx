import { content, Lang } from '@/lib/content'

interface ExpansionProps { lang: Lang }

export default function Expansion({ lang }: ExpansionProps) {
  const t = content.expansion[lang]

  return (
    <section id="expansion" className="section-white">
      <div className="container">
        <div style={{ maxWidth: '640px', marginBottom: 'var(--space-3xl)' }}>
          <p className="section-label">{t.label}</p>
          <h2 className="t-section-title" style={{ color: 'var(--color-navy)', marginBottom: 'var(--space-sm)' }}>
            {t.title}
          </h2>
          <p className="t-body-lg" style={{ color: 'var(--color-gray)' }}>{t.subtitle}</p>
          <div className="divider" />
        </div>

        <div className="steps-grid">
          {t.steps.map((step, i) => (
            <div key={i} className="step-card">
              <div className="step-card__num">{step.num}</div>
              <div className="step-card__title">{step.title}</div>
              <p className="step-card__body">{step.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
