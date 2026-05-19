import { content, Lang } from '@/lib/content'

interface AboutProps { lang: Lang }

export default function About({ lang }: AboutProps) {
  const t = content.about[lang]

  return (
    <section id="about" className="section-light">
      {/* Content */}
      <div className="container" style={{ paddingTop: 'var(--space-3xl)' }}>
        <div className="split">
          {/* Left */}
          <div>
            <p className="section-label">{t.label}</p>
            <h2 className="t-section-title" style={{ color: 'var(--color-navy)' }}>
              {t.title}
            </h2>
            <div className="divider" />
          </div>

          {/* Right */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
            <p className="t-body-lg" style={{ color: 'var(--color-navy)' }}>{t.p1}</p>
            <p className="t-body" style={{ color: 'var(--color-gray)' }}>{t.p2}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
