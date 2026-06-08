import { content, Lang } from '@/lib/content'

const LinkedinIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>
  </svg>
)

const InstagramIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
)

const TwitterIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
)

interface FooterProps { lang: Lang }

const navAnchors: Record<string, string> = {
  'About': '#about', 'Vision': '#vision', 'Market': '#market',
  'Sederhana': '#sederhana', 'Expansion': '#expansion', 'Why GMV': '#why-gmv',
  'Footprint': '#footprint', 'Press': '#press',
  'Contact': '#contact', 'LinkedIn': '#', 'Instagram': '#', 'Twitter/X': '#',
  // ID
  'Tentang': '#about', 'Visi': '#vision', 'Pasar': '#market',
  'Ekspansi': '#expansion', 'Mengapa GMV': '#why-gmv',
  'Jejak Global': '#footprint', 'Media': '#press',
  'Kontak': '#contact',
}

export default function Footer({ lang }: FooterProps) {
  const t = content.footer[lang]

  return (
    <footer className="footer" role="contentinfo">
      <div className="container">
        <div className="footer-top">
          {/* Brand col */}
          <div>
            <div className="footer-tagline">{t.tagline}</div>
            <p className="t-caption" style={{ color: 'rgba(255,255,255,0.35)', maxWidth: '280px' }}>
              {lang === 'en'
                ? 'The official licensed partner of Restoran Sederhana — scaling Padang cuisine to international markets.'
                : 'Mitra lisensi resmi Restoran Sederhana — membawa kuliner Padang ke pasar internasional.'}
            </p>
            <div style={{ display: 'flex', gap: 'var(--space-md)', marginTop: 'var(--space-lg)' }}>
              <a href="#" aria-label="LinkedIn" style={{ color: 'rgba(255,255,255,0.35)', transition: 'color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-white)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.35)')}>
                <LinkedinIcon />
              </a>
              <a href="https://instagram.com/sederhanaglobal" target="_blank" rel="noopener noreferrer" aria-label="Instagram" style={{ color: 'rgba(255,255,255,0.35)', transition: 'color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-white)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.35)')}>
                <InstagramIcon />
              </a>
              <a href="#" aria-label="Twitter/X" style={{ color: 'rgba(255,255,255,0.35)', transition: 'color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-white)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.35)')}>
                <TwitterIcon />
              </a>
            </div>
          </div>

          {/* Nav cols */}
          {t.navCols.map((col, i) => (
            <div key={i}>
              <div className="footer-col__heading">{col.heading}</div>
              <ul className="footer-col__links">
                {col.links.map((link, j) => (
                  <li key={j}>
                    <a href={navAnchors[link] || '#'}>{link}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="footer-bottom">
          <span className="footer-copyright">{t.copyright}</span>
          <div style={{ display: 'flex', gap: 'var(--space-lg)' }}>
            {t.legal.map((l, i) => (
              <a
                key={i}
                href="#"
                style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)', transition: 'color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.7)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.3)')}
              >
                {l}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Watermark */}
      <div className="footer-watermark" aria-hidden="true">
        <img
          className="footer-watermark__logo"
          src={(content as any).footer_logo_src || "/assets/Logo-Footer.svg"}
          alt=""
        />
      </div>

      <style>{`
        .footer-watermark__logo {
          width: 60%;
          height: auto;
          opacity: 0.06;
          display: block;
          margin: 0 auto;
        }
        @media (min-width: 1024px) {
          .footer-watermark__logo {
            width: 30%;
          }
        }
      `}</style>
    </footer>
  )
}
