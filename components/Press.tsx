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
              {item.image && (
                <div style={{ width: '100%', aspectRatio: '16/9', overflow: 'hidden', borderRadius: '4px', marginBottom: '12px' }}>
                  <img src={item.image} alt={item.headline} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              )}
              <div className="press-card__pub">{item.publication}</div>
              <div className="press-card__headline">
                {item.headline}
              </div>
              <div className="press-card__date">{item.date}</div>
              <a href={item.url || "#"} target={item.url ? "_blank" : undefined} rel="noopener noreferrer" className="press-card__link">
                {lang === 'en' ? 'Read Article →' : 'Baca Artikel →'}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
