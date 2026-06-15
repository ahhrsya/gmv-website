'use client'

import Link from 'next/link'
import { Lang } from '@/lib/content'
import { usePersistedLang } from '@/lib/usePersistedLang'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import CopyLinkButton from '@/components/CopyLinkButton'

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

interface ArticleContentProps {
  article: ArticleData
  related: ArticleData[]
}

const BASE_URL = 'https://global-minang-ventura.vercel.app'

export default function ArticleContent({ article, related }: ArticleContentProps) {
  const [lang, setLang] = usePersistedLang()

  const formatDate = (d: string) => {
    try { return new Date(d).toLocaleDateString(lang === 'en' ? 'en-GB' : 'id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) }
    catch { return d }
  }

  const title = lang === 'en' ? article.title_en : article.title_id
  const body = lang === 'en' ? article.content_en : article.content_id
  const excerpt = lang === 'en' ? article.excerpt_en : article.excerpt_id
  const pageUrl = `${BASE_URL}/articles/${article.slug}/`

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

                {/* Cover Image — show_image field controls visibility */}
                {article.cover_image && (article as any).show_image !== false && (
                  <div style={{ marginBottom: 'var(--space-3xl)', overflow: 'hidden' }}>
                    <img src={article.cover_image} alt={title} width={1200} height={630} style={{ width: '100%', height: 'auto', display: 'block' }} />
                  </div>
                )}

                {/* Body */}
                <div>
                  {body.split('\n').filter(Boolean).map((para, i) => {
                    if (para.startsWith('## ')) return <h2 key={i} className="t-subsection" style={{ color: 'var(--color-navy)', margin: 'var(--space-3xl) 0 var(--space-lg)' }}>{para.slice(3)}</h2>
                    if (para.startsWith('### ')) return <h3 key={i} className="t-body-lg" style={{ color: 'var(--color-navy)', fontWeight: 700, margin: 'var(--space-xl) 0 var(--space-sm)' }}>{para.slice(4)}</h3>
                    if (para.startsWith('> ')) return (
                      <blockquote key={i} style={{ borderLeft: '3px solid var(--color-navy)', paddingLeft: 'var(--space-lg)', margin: 'var(--space-xl) 0', fontStyle: 'italic' }}>
                        <p className="t-body-lg" style={{ color: 'var(--color-navy)', lineHeight: 1.7 }}>{para.slice(2)}</p>
                      </blockquote>
                    )
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
                    <a
                      href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(pageUrl)}`}
                      target="_blank" rel="noopener noreferrer"
                      style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', border: '1px solid var(--color-mist)', borderRadius: '2px', fontSize: '13px', fontWeight: 600, color: 'var(--color-navy)', textDecoration: 'none', transition: 'background 0.2s' }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-bone)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    >𝕏 {lang === 'en' ? 'Share on X' : 'Bagikan di X'}</a>
                    <a
                      href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(pageUrl)}&title=${encodeURIComponent(title)}`}
                      target="_blank" rel="noopener noreferrer"
                      style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', border: '1px solid var(--color-mist)', borderRadius: '2px', fontSize: '13px', fontWeight: 600, color: 'var(--color-navy)', textDecoration: 'none', transition: 'background 0.2s' }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-bone)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    >in {lang === 'en' ? 'Share on LinkedIn' : 'Bagikan di LinkedIn'}</a>
                    <CopyLinkButton lang={lang} />
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
