// @ts-nocheck
import { content, Lang } from '@/lib/content'
import { ComposableMap, Geographies, Geography, Marker, Line } from 'react-simple-maps'

interface FootprintProps { lang: Lang }

export default function Footprint({ lang }: FootprintProps) {
  const t = content.footprint[lang]

  return (
    <section
      id="footprint"
      style={{
        backgroundColor: '#1B2F6E',
        padding: 'var(--space-3xl) 0',
        position: 'relative',
        overflow: 'hidden'
      }}
      aria-label="Global Footprint section"
    >
      <div className="container" style={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
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

        {/* Map Container - Exact Size and Blending */}
        <div
          style={{
            margin: 'var(--space-3xl) auto',
            width: '100%',
            height: '500px',
            position: 'relative',
            overflow: 'hidden',
            border: 'none',
            boxShadow: 'none',
          }}
        >
          {/* TOP Gradient Overlay */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '80px',
              background: 'linear-gradient(to bottom, #1B2F6E 0%, transparent 100%)',
              pointerEvents: 'none',
              zIndex: 10,
            }}
          />

          {/* BOTTOM Gradient Overlay */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '80px',
              background: 'linear-gradient(to top, #1B2F6E 0%, transparent 100%)',
              pointerEvents: 'none',
              zIndex: 10,
            }}
          />

          {/* LEFT Gradient Overlay */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              bottom: 0,
              width: '120px',
              background: 'linear-gradient(to right, #1B2F6E 0%, transparent 100%)',
              pointerEvents: 'none',
              zIndex: 10,
            }}
          />

          {/* RIGHT Gradient Overlay */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              bottom: 0,
              width: '120px',
              background: 'linear-gradient(to left, #1B2F6E 0%, transparent 100%)',
              pointerEvents: 'none',
              zIndex: 10,
            }}
          />

          <style>{`
            @keyframes pulse {
              0% { r: 6; opacity: 0.8; }
              100% { r: 24; opacity: 0; }
            }
            .pulse-animation {
              animation: pulse 2s infinite;
              transform-origin: center;
            }
            .pulse-animation-delayed {
              animation: pulse 2s infinite;
              animation-delay: 0.5s;
              transform-origin: center;
            }
          `}</style>

          <ComposableMap
            projection="geoMercator"
            projectionConfig={{
              scale: 420,
              center: [125, -8]
            }}
            style={{
              width: '100%',
              height: '100%',
            }}
          >
            <Geographies geography="https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json">
              {({ geographies }) =>
                geographies.map((geo) => (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill="#2A3F7E"
                    stroke="#3D5499"
                    strokeWidth={0.5}
                    style={{
                      default: { outline: 'none' },
                      hover: { fill: '#39509E', outline: 'none' },
                      pressed: { outline: 'none' }
                    }}
                  />
                ))
              }
            </Geographies>

            {/* Connecting line */}
            <Line
              from={[103.8198, 1.3521]} // Singapore
              to={[144.9631, -37.8136]} // Melbourne
              stroke="#F5A623"
              strokeWidth={1}
              opacity={0.5}
              strokeDasharray="4 4"
            />

            {/* Singapore Marker */}
            <Marker coordinates={[103.8198, 1.3521]}>
              <circle
                cx={0}
                cy={0}
                r={14}
                fill="#F5A623"
                opacity={0.3}
                className="pulse-animation"
              />
              <circle
                cx={0}
                cy={0}
                r={6}
                fill="#F5A623"
              />
              <text
                textAnchor="middle"
                y={-24}
                fill="#FFFFFF"
                fontSize={11}
                fontWeight="bold"
                style={{ fontFamily: 'var(--font-body)', letterSpacing: '0.5px' }}
              >
                SINGAPORE
              </text>
              <text
                textAnchor="middle"
                y={-12}
                fill="#4CAF50"
                fontSize={9}
                fontWeight="bold"
                style={{ fontFamily: 'var(--font-body)', letterSpacing: '0.5px' }}
              >
                • OPERATIONAL
              </text>
            </Marker>

            {/* Melbourne Marker */}
            <Marker coordinates={[144.9631, -37.8136]}>
              <circle
                cx={0}
                cy={0}
                r={14}
                fill="#F5A623"
                opacity={0.3}
                className="pulse-animation-delayed"
              />
              <circle
                cx={0}
                cy={0}
                r={6}
                fill="#F5A623"
              />
              <text
                textAnchor="middle"
                y={-34}
                fill="#FFFFFF"
                fontSize={11}
                fontWeight="bold"
                style={{ fontFamily: 'var(--font-body)', letterSpacing: '0.5px' }}
              >
                MELBOURNE
              </text>
              <text
                textAnchor="middle"
                y={-22}
                fill="rgba(255,255,255,0.6)"
                fontSize={9}
                fontWeight="bold"
                style={{ fontFamily: 'var(--font-body)', letterSpacing: '0.5px' }}
              >
                AUSTRALIA
              </text>
              <text
                textAnchor="middle"
                y={-10}
                fill="#4CAF50"
                fontSize={9}
                fontWeight="bold"
                style={{ fontFamily: 'var(--font-body)', letterSpacing: '0.5px' }}
              >
                • OPERATIONAL
              </text>
            </Marker>
          </ComposableMap>
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
