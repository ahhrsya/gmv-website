import { content, Lang } from '@/lib/content'

interface TeamProps { lang: Lang }

export default function Team({ lang }: TeamProps) {
  const t = content.team[lang]

  return (
    <section id="team" className="section-light">
      <div className="container">
        <div style={{ maxWidth: '560px', marginBottom: 'var(--space-3xl)' }}>
          <p className="section-label">{t.label}</p>
          <h2 className="t-section-title" style={{ color: 'var(--color-navy)' }}>
            {t.title}
          </h2>
          <div className="divider" />
        </div>

        <div className="team-grid">
          {t.members.map((member, i) => (
            <div key={i} className="team-card">
              {/* Photo placeholder */}
              <div className="team-card__photo">
                <span className="team-card__photo-placeholder">{member.initials}</span>
              </div>
              <div className="team-card__name">{member.name}</div>
              <div className="team-card__role">{member.role}</div>
              <p className="team-card__bio">{member.bio}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
