'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { content, Lang } from '@/lib/content'

interface Article {
  slug: string
  title_en: string
  title_id: string
  date: string
  category: string
  cover_image: string
  excerpt_en: string
  excerpt_id: string
  published: boolean
  author: string
  read_time: number
}

interface PressProps { lang: Lang }

export default function Press({ lang }: PressProps) {
  const t = content.press[lang]
  const [articles, setArticles] = useState<Article[]>([])

  useEffect(() => {
    fetch('/articles-index.json')
      .then(r => r.json())
      .then((data: Article[]) => {
        setArticles(data.filter(a => a.published).slice(0, 4))
      })
      .catch(() => setArticles([]))
  }, [])

  const formatDate = (d: string) => {
    try {
      return new Date(d).toLocaleDateString(lang === 'en' ? 'en-GB' : 'id-ID', {
        day: 'numeric', month: 'long', year: 'numeric'
      })
    } catch { return d }
  }

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
          {articles.map((article, i) => (
            <Link
              key={article.slug}
              href={`/articles/${article.slug}`}
              style={{ textDecoration: 'none' }}
            >
              <article
                className="press-card"
                aria-label={lang === 'en' ? article.title_en : article.title_id}
                style={{ borderRadius: 0 }}
                onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-bone)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                {article.cover_image && (
                  <div style={{ width: '100%', aspectRatio: '16/9', overflow: 'hidden', background: 'var(--color-black)', borderRadius: 0, marginBottom: '12px' }}>
                    <img
                      src={article.cover_image}
                      alt={lang === 'en' ? article.title_en : article.title_id}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.4s var(--ease-out)' }}
                      onMouseEnter={e => ((e.currentTarget as HTMLImageElement).style.transform = 'scale(1.04)')}
                      onMouseLeave={e => ((e.currentTarget as HTMLImageElement).style.transform = 'scale(1)')}
                    />
                  </div>
                )}
                <div className="press-card__pub">{article.category}</div>
                <div className="press-card__headline">
                  {lang === 'en' ? article.title_en : article.title_id}
                </div>
                <div className="press-card__date">{formatDate(article.date)}</div>
                <div className="press-card__link" style={{ marginTop: 'var(--space-sm)' }}>
                  {lang === 'en' ? 'Read Article →' : 'Baca Artikel →'}
                </div>
              </article>
            </Link>
          ))}
        </div>

        <div style={{ marginTop: 'var(--space-3xl)', textAlign: 'center' }}>
          <Link href="/articles">
            <button
              className="btn-primary"
              style={{
                borderRadius: 0,
                padding: '14px 32px',
                fontSize: '14px',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
              }}
            >
              {lang === 'en' ? 'View More →' : 'Lihat Selengkapnya →'}
            </button>
          </Link>
        </div>
      </div>
    </section>
  )
}
