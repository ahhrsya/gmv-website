'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { content, Lang } from '@/lib/content'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

interface Article {
  slug: string
  title_en: string
  title_id: string
  date: string
  category: string
  excerpt_en: string
  excerpt_id: string
  published: boolean
  author: string
  read_time: number
}

const PER_PAGE = 9

function Breadcrumb({ lang }: { lang: Lang }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: 'var(--space-xl)' }}>
      <Link href="/" style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', transition: 'color 0.2s' }}
        onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.7)')}
        onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.35)')}
      >
        {lang === 'en' ? 'Home' : 'Beranda'}
      </Link>
      <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '12px' }}>›</span>
      <span style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.7)' }}>
        {lang === 'en' ? 'Articles' : 'Artikel'}
      </span>
    </div>
  )
}

export default function ArticlesPage() {
  const [lang, setLang] = useState<Lang>('en')
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const [page, setPage] = useState(1)

  useEffect(() => {
    fetch('/articles-index.json')
      .then(r => r.json())
      .then((data: Article[]) => { setArticles(data.filter(a => a.published)); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const categories = useMemo(() =>
    ['All', ...Array.from(new Set(articles.map(a => a.category))).sort()],
    [articles])

  const filtered = useMemo(() => articles.filter(a => {
    const title = lang === 'en' ? a.title_en : a.title_id
    const excerpt = lang === 'en' ? a.excerpt_en : a.excerpt_id
    return (!search || title.toLowerCase().includes(search.toLowerCase()) || excerpt.toLowerCase().includes(search.toLowerCase()))
      && (activeCategory === 'All' || a.category === activeCategory)
  }), [articles, search, activeCategory, lang])

  const totalPages = Math.ceil(filtered.length / PER_PAGE)
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  const formatDate = (d: string) => {
    try { return new Date(d).toLocaleDateString(lang === 'en' ? 'en-GB' : 'id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) }
    catch { return d }
  }

  return (
    <>
      <Navbar lang={lang} onLangChange={setLang} />
      <main>

        {/* ── HEADER ── */}
        <section style={{ background: 'var(--color-black)', paddingTop: '100px', paddingBottom: 'var(--space-3xl)' }}>
          <div className="container">
            <Breadcrumb lang={lang} />
            <h1 className="t-section-title" style={{ color: 'var(--color-white)', maxWidth: '560px' }}>
              {lang === 'en' ? 'Latest from GMV' : 'Terbaru dari GMV'}
            </h1>
          </div>
        </section>

        {/* ── FILTER BAR ── */}
        <div style={{ background: 'var(--color-white)', borderBottom: '1px solid var(--color-mist)', position: 'sticky', top: '64px', zIndex: 40 }}>
          <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--space-md) var(--space-lg)', gap: 'var(--space-md)', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {categories.map(cat => (
                <button key={cat} onClick={() => { setActiveCategory(cat); setPage(1) }}
                  style={{
                    padding: '6px 14px', borderRadius: '999px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s',
                    background: activeCategory === cat ? 'var(--color-navy)' : 'transparent',
                    color: activeCategory === cat ? 'var(--color-white)' : 'var(--color-gray)',
                    border: `1px solid ${activeCategory === cat ? 'var(--color-navy)' : 'var(--color-mist)'}`,
                  }}>
                  {cat}
                </button>
              ))}
            </div>
            <div style={{ position: 'relative' }}>
              <input type="text"
                placeholder={lang === 'en' ? 'Search articles…' : 'Cari artikel…'}
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1) }}
                style={{
                  padding: '8px 16px 8px 36px', border: '1px solid var(--color-mist)', borderRadius: '999px',
                  fontSize: '13px', fontFamily: 'var(--font-body)', color: 'var(--color-navy)',
                  background: 'var(--color-bone)', outline: 'none', width: '220px',
                }}
              />
              <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-silver)', fontSize: '14px', pointerEvents: 'none' }}>⌕</span>
            </div>
          </div>
        </div>

        {/* ── GRID ── */}
        <section className="section-white" style={{ minHeight: '60vh' }}>
          <div className="container">
            {loading ? (
              <div style={{ textAlign: 'center', padding: 'var(--space-4xl)', color: 'var(--color-silver)' }}>
                <p className="t-body">{lang === 'en' ? 'Loading…' : 'Memuat…'}</p>
              </div>
            ) : paginated.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 'var(--space-4xl)' }}>
                <p className="t-body-lg" style={{ color: 'var(--color-navy)', marginBottom: 'var(--space-sm)' }}>
                  {lang === 'en' ? 'No articles found.' : 'Artikel tidak ditemukan.'}
                </p>
                <p className="t-body" style={{ color: 'var(--color-gray)' }}>
                  {lang === 'en' ? 'Try a different search or category.' : 'Coba pencarian atau kategori lain.'}
                </p>
              </div>
            ) : (
              <>
                <p style={{ fontSize: '12px', color: 'var(--color-silver)', marginBottom: 'var(--space-xl)', fontFamily: 'var(--font-mono)' }}>
                  {lang === 'en' ? `${filtered.length} article${filtered.length !== 1 ? 's' : ''}` : `${filtered.length} artikel`}
                </p>

                {/* Article grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', borderTop: '1px solid var(--color-mist)', borderLeft: '1px solid var(--color-mist)' }} className="articles-grid">
                  {paginated.map((article) => (
                    <Link key={article.slug} href={`/articles/${article.slug}`} style={{ textDecoration: 'none' }}>
                      <article
                        style={{ borderRight: '1px solid var(--color-mist)', borderBottom: '1px solid var(--color-mist)', display: 'flex', flexDirection: 'column', height: '100%', cursor: 'pointer', transition: 'background 0.2s' }}
                        onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-bone)')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                      >
                        {/* Cover image */}
                        {article.cover_image && (
                          <div style={{ aspectRatio: '16/9', overflow: 'hidden', background: 'var(--color-black)', borderRadius: 0 }}>
                            <img
                              src={article.cover_image}
                              alt={lang === 'en' ? article.title_en : article.title_id}
                              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.4s var(--ease-out)' }}
                              onMouseEnter={e => ((e.currentTarget as HTMLImageElement).style.transform = 'scale(1.04)')}
                              onMouseLeave={e => ((e.currentTarget as HTMLImageElement).style.transform = 'scale(1)')}
                            />
                          </div>
                        )}
                        
                        {/* Content */}
                        <div style={{ padding: 'var(--space-xl) var(--space-lg)', display: 'flex', flexDirection: 'column', flex: 1 }}>
                          {/* Category + date */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: 'var(--space-md)' }}>
                            <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-navy)', background: 'var(--color-bone)', padding: '3px 8px', borderRadius: '0px' }}>
                              {article.category}
                            </span>
                            <span style={{ fontSize: '11px', color: 'var(--color-silver)' }}>
                              {formatDate(article.date)}
                            </span>
                          </div>

                          {/* Title */}
                          <h2 className="t-body-lg" style={{ color: 'var(--color-navy)', fontWeight: 700, marginBottom: 'var(--space-sm)', lineHeight: 1.3 }}>
                            {lang === 'en' ? article.title_en : article.title_id}
                          </h2>

                          {/* Excerpt */}
                          <p className="t-body" style={{ color: 'var(--color-gray)', flex: 1, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                            {lang === 'en' ? article.excerpt_en : article.excerpt_id}
                          </p>

                          {/* Footer */}
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'var(--space-lg)', paddingTop: 'var(--space-md)', borderTop: '1px solid var(--color-mist)' }}>
                            <span style={{ fontSize: '11px', color: 'var(--color-silver)' }}>
                              {article.author} · {article.read_time} {lang === 'en' ? 'min' : 'mnt'}
                            </span>
                            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-navy)' }}>
                              {lang === 'en' ? 'Read →' : 'Baca →'}
                            </span>
                          </div>
                        </div>
                      </article>
                    </Link>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: 'var(--space-3xl)', paddingTop: 'var(--space-xl)', borderTop: '1px solid var(--color-mist)' }}>
                    <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                      style={{ padding: '8px 16px', border: '1px solid var(--color-mist)', borderRadius: '2px', fontSize: '13px', fontWeight: 600, cursor: page === 1 ? 'not-allowed' : 'pointer', color: page === 1 ? 'var(--color-silver)' : 'var(--color-navy)', background: 'transparent' }}>
                      ← {lang === 'en' ? 'Prev' : 'Sebelumnya'}
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                      <button key={p} onClick={() => setPage(p)}
                        style={{ width: '36px', height: '36px', border: '1px solid', borderColor: page === p ? 'var(--color-navy)' : 'var(--color-mist)', borderRadius: '2px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', background: page === p ? 'var(--color-navy)' : 'transparent', color: page === p ? 'var(--color-white)' : 'var(--color-gray)' }}>
                        {p}
                      </button>
                    ))}
                    <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                      style={{ padding: '8px 16px', border: '1px solid var(--color-mist)', borderRadius: '2px', fontSize: '13px', fontWeight: 600, cursor: page === totalPages ? 'not-allowed' : 'pointer', color: page === totalPages ? 'var(--color-silver)' : 'var(--color-navy)', background: 'transparent' }}>
                      {lang === 'en' ? 'Next' : 'Berikutnya'} →
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </section>

      </main>
      <Footer lang={lang} />
      <style>{`
        @media(max-width:900px){ .articles-grid{grid-template-columns:repeat(2,1fr)!important} }
        @media(max-width:600px){ .articles-grid{grid-template-columns:1fr!important} }
      `}</style>
    </>
  )
}
