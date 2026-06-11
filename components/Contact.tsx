'use client'

import { useState } from 'react'
import { content, Lang } from '@/lib/content'
import { ArrowRight, Mail } from 'lucide-react'

interface ContactProps { lang: Lang }

export default function Contact({ lang }: ContactProps) {
  const t = content.contact[lang]
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [formLoadedAt] = useState(() => Date.now())

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const form = e.currentTarget
    const formData = new FormData(form)

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.get('name'),
          email: formData.get('email'),
          organization: formData.get('organization'),
          market: formData.get('market'),
          message: formData.get('message'),
          website: formData.get('website'),
          formLoadedAt,
          lang,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to send message')
      }

      setSubmitted(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : (lang === 'en' ? 'Failed to send message. Please try again.' : 'Gagal mengirim pesan. Silakan coba lagi.'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <section
      id="contact"
      className="section-photo bg-cta-placeholder"
      aria-label="Contact and Join section"
    >
      <div
        className="section-photo__overlay"
        style={{ background: 'rgba(0,33,86,0.92)' }}
      />
      <div className="section-photo__content container">
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-4xl)' }}>
          <p className="section-label section-label--light">{t.label}</p>
          <h2
            className="t-section-title"
            style={{ color: 'var(--color-white)', maxWidth: '640px', margin: '0 auto var(--space-lg)' }}
          >
            {t.title}
          </h2>
          <p className="t-body-lg" style={{ color: 'rgba(255,255,255,0.65)', maxWidth: '520px', margin: '0 auto var(--space-xs)' }}>
            {t.p1}
          </p>
        </div>

        {/* Two-column: form + info */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1.6fr 1fr',
            gap: 'var(--space-3xl)',
            maxWidth: '1000px',
            margin: '0 auto',
          }}
          className="contact-grid"
        >
          {/* Form */}
          <div>
            {submitted ? (
              <div
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.25)',
                  borderRadius: '4px',
                  padding: 'var(--space-2xl)',
                  textAlign: 'center',
                }}
              >
                <div
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '28px',
                    fontWeight: 600,
                    color: 'var(--color-white)',
                    marginBottom: 'var(--space-sm)',
                  }}
                >
                  {lang === 'en' ? 'Message Sent' : 'Pesan Terkirim'}
                </div>
                <p className="t-body" style={{ color: 'rgba(255,255,255,0.6)' }}>
                  {lang === 'en'
                    ? "We'll be in touch soon."
                    : 'Kami akan segera menghubungi Anda.'}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="contact-form" noValidate style={{ position: 'relative' }}>
                {error && (
                  <div style={{ background: 'rgba(220,50,50,0.15)', border: '1px solid rgba(220,50,50,0.4)', borderRadius: '4px', padding: '12px 16px', marginBottom: 'var(--space-sm)' }}>
                    <p style={{ fontSize: '14px', color: '#ff6b6b', margin: 0 }}>{error}</p>
                  </div>
                )}
                <div className="form-row">
                  <div className="form-field">
                    <label htmlFor="contact-name">{t.fields.name}</label>
                    <input id="contact-name" name="name" type="text" placeholder={t.fields.name} required />
                  </div>
                  <div className="form-field">
                    <label htmlFor="contact-email">{t.fields.email}</label>
                    <input id="contact-email" name="email" type="email" placeholder={t.fields.email} required />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-field">
                    <label htmlFor="contact-org">{t.fields.org}</label>
                    <input id="contact-org" name="organization" type="text" placeholder={t.fields.org} />
                  </div>
                  <div className="form-field">
                    <label htmlFor="contact-market">{t.fields.market}</label>
                    <input id="contact-market" name="market" type="text" placeholder={t.fields.market} />
                  </div>
                </div>
                <div className="form-field">
                  <label htmlFor="contact-message">{t.fields.message}</label>
                  <textarea
                    id="contact-message"
                    name="message"
                    placeholder={t.fields.message}
                    rows={5}
                    required
                  />
                </div>
                {/* Honeypot — hidden from real users, bots fill it */}
                <div style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px', overflow: 'hidden' }} aria-hidden="true">
                  <label htmlFor="contact-website">Website</label>
                  <input id="contact-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
                </div>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={loading}
                  style={{ alignSelf: 'flex-start', opacity: loading ? 0.7 : 1 }}
                >
                  {loading
                    ? lang === 'en' ? 'Sending…' : 'Mengirim…'
                    : t.fields.submit}
                  {!loading && <ArrowRight size={15} />}
                </button>
              </form>
            )}
          </div>

          {/* Contact info */}
          <div className="contact-info">
            {t.offices.map((office, i) => (
              <div key={i}>
                <div className="contact-office__label">{office.label}</div>
                <div className="contact-office__city">{office.city}</div>
                <div className="contact-office__address">{office.address}</div>
              </div>
            ))}
            <div className="contact-direct">
              <a href={`mailto:${t.email}`} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Mail size={15} style={{ color: 'var(--color-white)' }} />
                {t.email}
              </a>
              <a href={`https://instagram.com/${t.instagram}`} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--color-white)' }}>
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                </svg>
                @{t.instagram}
              </a>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 1023px) {
          .contact-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}
