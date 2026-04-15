'use client'

import { useState } from 'react'
import { content, Lang } from '@/lib/content'
import { ArrowRight, Mail, Phone, MapPin } from 'lucide-react'

interface ContactProps { lang: Lang }

export default function Contact({ lang }: ContactProps) {
  const t = content.contact[lang]
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setSubmitted(true)
    }, 1200)
  }

  return (
    <section
      id="contact"
      className="section-photo bg-cta-placeholder"
      aria-label="Contact and Join section"
    >
      <div
        className="section-photo__overlay"
        style={{ background: 'rgba(10,10,10,0.92)' }}
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
          <p className="t-body" style={{ color: 'rgba(255,255,255,0.45)', maxWidth: '520px', margin: '0 auto' }}>
            {t.p2}
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
              <form onSubmit={handleSubmit} className="contact-form" noValidate>
                <div className="form-row">
                  <div className="form-field">
                    <label htmlFor="contact-name">{t.fields.name}</label>
                    <input id="contact-name" type="text" placeholder={t.fields.name} required />
                  </div>
                  <div className="form-field">
                    <label htmlFor="contact-email">{t.fields.email}</label>
                    <input id="contact-email" type="email" placeholder={t.fields.email} required />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-field">
                    <label htmlFor="contact-org">{t.fields.org}</label>
                    <input id="contact-org" type="text" placeholder={t.fields.org} />
                  </div>
                  <div className="form-field">
                    <label htmlFor="contact-market">{t.fields.market}</label>
                    <input id="contact-market" type="text" placeholder={t.fields.market} />
                  </div>
                </div>
                <div className="form-field">
                  <label htmlFor="contact-message">{t.fields.message}</label>
                  <textarea
                    id="contact-message"
                    placeholder={t.fields.message}
                    rows={5}
                    required
                  />
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
              <a href={`tel:${t.phone}`} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Phone size={15} style={{ color: 'var(--color-white)' }} />
                {t.phone}
              </a>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 767px) {
          .contact-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}
