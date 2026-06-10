'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { content, Lang } from '@/lib/content'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import articlesData from '@/public/articles-index.json'

interface ArticleData {
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
  content_en: string
  content_id: string
}

export default function ArticleDetailPage({ params }: { params: { slug: string } }) {
  const [lang, setLang] = useState<Lang>('en')
  const [article, setArticle] = useState<ArticleData | null>(null)
  const [related, setRelated] = useState<ArticleData[]>([])
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  
  const { slug } = params

  useEffect(() => {
    if (!slug) return
    
    // Find article from imported data
    const found = (articlesData as ArticleData[]).find(a => a.slug === slug && a.published)
    
    if (!found) {
      setNotFound(true)
      setLoading(false)
      return
    }
    
    setArticle(found)
    
    // Get related articles
    const relatedArticles = (articlesData as ArticleData[])
      .filter(a => a.slug !== slug && a.published && a.category === found.category)
      .slice(0, 3)
    
    setRelated(relatedArticles)
    setLoading(false)
  }, [slug])

  const formatDate = (d: string) => {
    try { return new Date(d).toLocaleDateString(lang === 'en' ? 'en-GB' : 'id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) }
    catch { return d }
  }

  const title = article ? (lang === 'en' ? article.title_en : article.title_id) : ''
  const body = article ? (lang === 'en' ? article.content_en : article.content_id) : ''
  const excerpt = article ? (lang === 'en' ? article.excerpt_en : article.excerpt_id) : ''

  if (loading) return (
    <>
      <Navbar lang={lang} onLangChange={setLang} />
      <main style={{ minHeight: '80vh', display: 'grid', placeItems: 'center' }}>
        <p className="t-body" style={{ color: 'var(--color-silver)' }}>{lang === 'en' ? 'Loading…' : 'Memuat…'}</p>
      </main>
      <Footer lang={lang} />
    </>
  )

  if (notFound || !article) return (
    <>
      <Navbar lang={lang} onLangChange={setLang} />
      <main style={{ minHeight: '80vh', display: 'grid', placeItems: 'center', textAlign: 'center', padding: 'var(--space-4xl)' }}>
        <div>
          <p className="section-label" style={{ marginBottom: 'var(--space-md)' }}>404</p>
          <h1 className="t-section-title" style={{ color: 'var(--color-navy)', marginBottom: 'var(--space-lg)' }}>
            {lang === 'en' ? 'Article not found.' : 'Artikel tidak ditemukan.'}
          </h1>
          <Link href="/articles"><button className="btn-primary" style={{ background: 'var(--color-navy)', color: '#fff' }}>← {lang === 'en' ? 'Back to Articles' : 'Kembali ke Artikel'}</button></Link>
        </div>
      </main>
      <Footer lang={lang} />
    </>
  )

  return (
    <>
      <Navbar lang={lang} onLangChange={setLang} />
      <main>

        {/* ── HERO ── */}
        <section style={{ background: 'var(--color-black)', paddingTop: '100px', paddingBottom: 'var(--space-3xl)' }}>
          <div className="container">
            {/* Breadcrumb */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: 'var(--space-xl)' }}>
              <Link href="/" style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)' }}>
                {lang === 'en' ? 'Home' : 'Beranda'}
              </Link>
              <span style={{ color: 'rgba(255,255,255,0.2)' }}>›</span>
              <Link href="/articles" style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)' }}>
                {lang === 'en' ? 'Articles' : 'Artikel'}
              </Link>
              <span style={{ color: 'rgba(255,255,255,0.2)' }}>›</span>
              <span style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.7)' }}>
                {article.category}
              </span>
            </div>

            {/* Title */}
            <h1 className="t-section-title" style={{ color: 'var(--color-white)', maxWidth: '820px', lineHeight: 1.15 }}>
              {title}
            </h1>

            {/* Meta */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-lg)', marginTop: 'var(--space-xl)', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)', display: 'grid', placeItems: 'center', fontSize: '13px', fontWeight: 700, color: 'rgba(255,255,255,0.6)' }}>
                  {article.author.charAt(0)}
                </div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-white)' }}>{article.author}</div>
                  <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>{formatDate(article.date)}</div>
                </div>
              </div>
              <div style={{ width: '1px', height: '32px', background: 'rgba(255,255,255,0.1)' }} />
              <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>
                {article.read_time} {lang === 'en' ? 'min read' : 'menit baca'}
              </span>
              <div style={{ width: '1px', height: '32px', background: 'rgba(255,255,255,0.1)' }} />
              <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-white)', background: 'rgba(255,255,255,0.1)', padding: '4px 10px', borderRadius: '2px' }}>
                {article.category}
              </span>
            </div>
          </div>
        </section>

        {/* ── ARTICLE BODY ── */}
        <section className="section-white">
          <div className="container">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 260px', gap: 'var(--space-3xl)', alignItems: 'start' }} className="article-layout">

              {/* Main content */}
              <div>
                {/* Lead */}
                <p className="t-body-lg" style={{ color: 'var(--color-navy)', borderLeft: '3px solid var(--color-navy)', paddingLeft: 'var(--space-lg)', marginBottom: 'var(--space-3xl)', fontStyle: 'italic' }}>
                  {excerpt}
                </p>

                {/* Cover Image */}
                {article.cover_image && (
                  <div style={{ marginBottom: 'var(--space-3xl)', borderRadius: 0, overflow: 'hidden' }}>
                    <img 
                      src={article.cover_image} 
                      alt={title} 
                      style={{ width: '100%', height: 'auto', display: 'block', borderRadius: 0 }} 
                    />
                  </div>
                )}

                {/* Body */}
                <div>
                  {body.split('\n').filter(Boolean).map((para, i) => {
                    if (para.startsWith('## ')) return <h2 key={i} className="t-subsection" style={{ color: 'var(--color-navy)', margin: 'var(--space-3xl) 0 var(--space-lg)' }}>{para.slice(3)}</h2>
                    if (para.startsWith('### ')) return <h3 key={i} className="t-body-lg" style={{ color: 'var(--color-navy)', fontWeight: 700, margin: 'var(--space-xl) 0 var(--space-sm)' }}>{para.slice(4)}</h3>
                    if (para.startsWith('- ')) return <li key={i} className="t-body" style={{ color: 'var(--color-charcoal)', marginLeft: 'var(--space-lg)', marginBottom: 'var(--space-xs)', lineHeight: 1.8 }}>{para.slice(2)}</li>
                    return <p key={i} className="t-body" style={{ color: 'var(--color-charcoal)', marginBottom: 'var(--space-lg)', lineHeight: 1.85 }}>{para}</p>
                  })}
                </div>
              </div>

              {/* Sidebar */}
              <aside style={{ position: 'sticky', top: '84px' }}>

                {/* Author */}
                <div style={{ border: '1px solid var(--color-mist)', borderRadius: '2px', padding: 'var(--space-lg)', marginBottom: 'var(--space-lg)' }}>
                  <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-silver)', marginBottom: 'var(--space-md)' }}>
                    {lang === 'en' ? 'Author' : 'Penulis'}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'var(--color-black)', display: 'grid', placeItems: 'center', fontSize: '16px', fontWeight: 700, color: 'rgba(255,255,255,0.6)', flexShrink: 0 }}>
                      {article.author.charAt(0)}
                    </div>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-navy)' }}>{article.author}</div>
                      <div style={{ fontSize: '12px', color: 'var(--color-gray)' }}>Global Minang Ventura</div>
                    </div>
                  </div>
                </div>

                {/* Share */}
                <div style={{ border: '1px solid var(--color-mist)', borderRadius: '2px', padding: 'var(--space-lg)' }}>
                  <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-silver)', marginBottom: 'var(--space-md)' }}>
                    {lang === 'en' ? 'Share' : 'Bagikan'}
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <a href={`/articles/${article.slug}`} style={{ display: 'flex', alignItems: 'center', padding: '8px 12px', border: '1px solid var(--color-mist)', borderRadius: '2px', fontSize: '13px', fontWeight: 600, color: 'var(--color-navy)', transition: 'background 0.2s', textDecoration: 'none' }}>
                      🔗 {lang === 'en' ? 'Copy link' : 'Salin tautan'}
                    </a>
                  </div>
                </div>

              </aside>
            </div>
          </div>
        </section>

        {/* ── RELATED ── */}
        {related.length > 0 && (
          <section className="section-light">
            <div className="container">
              <div style={{ marginBottom: 'var(--space-3xl)' }}>
                <p className="section-label">{lang === 'en' ? 'RELATED ARTICLES' : 'ARTIKEL TERKAIT'}</p>
                <h2 className="t-subsection" style={{ color: 'var(--color-navy)' }}>
                  {lang === 'en' ? 'You might also like' : 'Mungkin juga menarik'}
                </h2>
                <div className="divider" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: `repeat(${related.length}, 1fr)`, borderTop: '1px solid var(--color-mist)', borderLeft: '1px solid var(--color-mist)' }} className="related-grid">
                {related.map(rel => (
                  <Link key={rel.slug} href={`/articles/${rel.slug}`} style={{ textDecoration: 'none' }}>
                    <article
                      style={{ borderRight: '1px solid var(--color-mist)', borderBottom: '1px solid var(--color-mist)', padding: 'var(--space-xl) var(--space-lg)', cursor: 'pointer', transition: 'background 0.2s' }}
                    >
                      <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-silver)', marginBottom: '8px' }}>{rel.category}</p>
                      <h3 className="t-body-lg" style={{ color: 'var(--color-navy)', fontWeight: 700, marginBottom: 'var(--space-sm)', lineHeight: 1.3 }}>{lang === 'en' ? rel.title_en : rel.title_id}</h3>
                      <p className="t-body" style={{ color: 'var(--color-gray)', marginBottom: 'var(--space-md)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {lang === 'en' ? rel.excerpt_en : rel.excerpt_id}
                      </p>
                      <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-navy)' }}>{lang === 'en' ? 'Read →' : 'Baca →'}</span>
                    </article>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── BOTTOM CTA ── */}
        <section style={{ background: 'var(--color-navy)', padding: 'var(--space-3xl) 0' }}>
          <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-lg)' }}>
            <Link href="/articles">
              <button style={{ padding: '12px 24px', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '999px', fontSize: '13px', fontWeight: 600, color: 'rgba(255,255,255,0.65)', background: 'transparent', cursor: 'pointer', transition: 'all 0.2s' }}>
                ← {lang === 'en' ? 'All Articles' : 'Semua Artikel'}
              </button>
            </Link>
            <Link href="/contact">
              <button className="btn-primary">{lang === 'en' ? 'Partner with GMV →' : 'Bermitra dengan GMV →'}</button>
            </Link>
          </div>
        </section>

      </main>
      <Footer lang={lang} />
      <style>{`
        @media(max-width:900px){
          .article-layout{grid-template-columns:1fr!important}
          .related-grid{grid-template-columns:1fr!important}
        }
      `}</style>
    </>
  )
}
