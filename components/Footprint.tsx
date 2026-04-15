import { content, Lang } from '@/lib/content'

interface FootprintProps { lang: Lang }

export default function Footprint({ lang }: FootprintProps) {
  const t = content.footprint[lang]

  return (
    <section
      id="footprint"
      className="section-photo bg-footprint-placeholder"
      aria-label="Global Footprint section"
    >
      <div
        className="section-photo__overlay"
        style={{ background: 'rgba(10,10,10,0.82)' }}
      />
      <div className="section-photo__content container" style={{ textAlign: 'center' }}>
        <p className="section-label section-label--light">{t.label}</p>
        <h2
          className="t-section-title"
          style={{ color: 'var(--color-white)', marginBottom: 'var(--space-sm)' }}
        >
          {t.title}
        </h2>
        <p className="t-body-lg" style={{ color: 'rgba(255,255,255,0.65)' }}>
          {t.subtitle}
        </p>

        {/* SVG World Map Outline */}
        <div
          style={{
            margin: 'var(--space-3xl) auto',
            maxWidth: '860px',
            position: 'relative',
          }}
        >
          {/* Simplified world map SVG */}
          <svg
            viewBox="0 0 1000 500"
            xmlns="http://www.w3.org/2000/svg"
            style={{ width: '100%', opacity: 0.18 }}
            aria-hidden="true"
          >
            {/* Simplified continent outlines */}
            {/* North America */}
            <path d="M 80 80 L 200 70 L 230 120 L 220 200 L 180 240 L 140 220 L 100 200 L 70 150 Z" fill="none" stroke="white" strokeWidth="1.5"/>
            {/* South America */}
            <path d="M 160 260 L 210 250 L 230 320 L 220 400 L 180 430 L 150 380 L 140 300 Z" fill="none" stroke="white" strokeWidth="1.5"/>
            {/* Europe */}
            <path d="M 430 60 L 510 55 L 530 100 L 510 130 L 470 135 L 440 110 Z" fill="none" stroke="white" strokeWidth="1.5"/>
            {/* Africa */}
            <path d="M 450 150 L 530 140 L 550 250 L 510 350 L 470 350 L 440 250 Z" fill="none" stroke="white" strokeWidth="1.5"/>
            {/* Asia */}
            <path d="M 540 50 L 800 45 L 820 180 L 750 220 L 650 200 L 570 160 L 540 100 Z" fill="none" stroke="white" strokeWidth="1.5"/>
            {/* Australia */}
            <path d="M 730 300 L 840 290 L 860 370 L 820 400 L 750 390 L 720 350 Z" fill="none" stroke="white" strokeWidth="1.5"/>
            {/* Indonesia region */}
            <path d="M 700 230 L 780 225 L 790 255 L 720 260 Z" fill="none" stroke="white" strokeWidth="1"/>

            {/* Location pins */}
            {/* Australia */}
            <circle cx="790" cy="340" r="6" fill="#FFFFFF" stroke="#FFFFFF" strokeWidth="2"/>
            <circle cx="790" cy="340" r="12" fill="none" stroke="#FFFFFF" strokeWidth="1" opacity="0.5"/>

            {/* Singapore */}
            <circle cx="735" cy="245" r="6" fill="#FFFFFF" stroke="#FFFFFF" strokeWidth="2"/>
            <circle cx="735" cy="245" r="12" fill="none" stroke="#FFFFFF" strokeWidth="1" opacity="0.5"/>

            {/* Hamburg, Germany */}
            <circle cx="480" cy="80" r="6" fill="#FFFFFF" stroke="#FFFFFF" strokeWidth="2"/>
            <circle cx="480" cy="80" r="12" fill="none" stroke="#FFFFFF" strokeWidth="1" opacity="0.5"/>
          </svg>
        </div>

        {/* Location cards */}
        <div className="map-pins">
          {t.locations.map((loc, i) => (
            <div key={i} className="map-pin">
              <div className="map-pin__dot" />
              <div className="map-pin__country">{loc.country}</div>
              <div className="map-pin__country" style={{ fontWeight: 400, opacity: 0.65, fontSize: '13px' }}>
                {loc.city}
              </div>
              <span
                className={`map-pin__status ${
                  loc.status === 'active' ? 'map-pin__status--active' : 'map-pin__status--launching'
                }`}
              >
                {loc.status === 'active'
                  ? lang === 'en' ? 'Operational' : 'Beroperasi'
                  : lang === 'en' ? 'Launching 2026' : 'Peluncuran 2026'}
              </span>
            </div>
          ))}
        </div>

        {/* Closing */}
        <p
          className="t-body"
          style={{
            color: 'rgba(255,255,255,0.55)',
            marginTop: 'var(--space-3xl)',
            maxWidth: '600px',
            margin: 'var(--space-3xl) auto 0',
          }}
        >
          {t.closing}
        </p>
      </div>
    </section>
  )
}
