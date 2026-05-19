import { content, Lang } from '@/lib/content'

interface PressProps { lang: Lang }

export default function Press({ lang }: PressProps) {
  const t = content.press[lang]

  return (
    <section id="press" className="section-white">
      <div className="container">
        <div style={{ maxWidth: '560px', marginBottom: 'var(--space-3xl)' }}>
          <p className="section-label">{t.label}</p>
          <h2 className="t-section-title" style={{ color: 'var(--color-navy)' }}>
            {t.title}
          </h2>
          <div className="divider" />
        </div>

        <div className="press-grid">
          {t.items.map((item, i) => (
            <div key={i} className="press-card" aria-label={item.headline}>
              <div className="press-card__pub">{item.publication}</div>
              <div className="press-card__headline">
                {item.headline}
              </div>
              <div className="press-card__date">{item.date}</div>
              <a href="#" className="press-card__link">
                {lang === 'en' ? 'Read Article →' : 'Baca Artikel →'}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
