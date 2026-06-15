import { notFound } from 'next/navigation'
import { promises as fs } from 'fs'
import path from 'path'
import type { Metadata } from 'next'
import ArticleContent from './ArticleContent'
import articlesData from '@/public/articles-index.json'

const BASE_URL = 'https://global-minang-ventura.vercel.app'

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

export const dynamicParams = false

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> | { slug: string } }
): Promise<Metadata> {
  const { slug } = await params
  const article = await getArticle(slug)
  if (!article) return {}

  const ogImages = article.cover_image
    ? [{ url: article.cover_image, width: 1200, height: 630, alt: article.title_en }]
    : []

  return {
    title: `${article.title_en} — Global Minang Ventura`,
    description: article.excerpt_en,
    authors: [{ name: article.author }],
    openGraph: {
      title: article.title_en,
      description: article.excerpt_en,
      type: 'article',
      publishedTime: article.date,
      authors: [article.author],
      siteName: 'Global Minang Ventura',
      url: `${BASE_URL}/articles/${article.slug}/`,
      images: ogImages,
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title_en,
      description: article.excerpt_en,
      ...(ogImages.length > 0 && { images: [ogImages[0].url] }),
    },
  }
}

export function generateStaticParams() {
  const articles = articlesData as ArticleData[]
  return articles
    .filter(a => a.published)
    .map(article => ({ slug: article.slug }))
}

async function getArticle(slug: string): Promise<ArticleData | null> {
  try {
    const cwd = process.cwd()
    const filePath = path.join(cwd, 'public', 'articles', `${slug}.json`)
    console.log('Reading article:', filePath, 'exists:', await fs.stat(filePath).then(() => true).catch(() => false))
    const file = await fs.readFile(filePath, 'utf-8')
    const data = JSON.parse(file) as ArticleData
    if (!data.published) return null
    return data
  } catch (e) {
    console.error('Error reading article:', slug, e)
    return null
  }
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> | { slug: string } }) {
  const resolved = await params
  const { slug } = resolved
  const article = await getArticle(slug)
  
  if (!article) {
    notFound()
  }

  // Get related articles from index
  const related = (articlesData as ArticleData[])
    .filter(a => a.slug !== slug && a.published && a.category === article.category)
    .slice(0, 3)

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title_en,
    description: article.excerpt_en,
    datePublished: article.date,
    author: {
      '@type': 'Organization',
      name: article.author,
      url: BASE_URL,
    },
    publisher: {
      '@id': `${BASE_URL}/#organization`,
    },
    url: `${BASE_URL}/articles/${article.slug}/`,
    ...(article.cover_image && { image: article.cover_image }),
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${BASE_URL}/` },
        { '@type': 'ListItem', position: 2, name: 'Articles', item: `${BASE_URL}/articles/` },
        { '@type': 'ListItem', position: 3, name: article.title_en, item: `${BASE_URL}/articles/${article.slug}/` },
      ],
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <ArticleContent article={article} related={related} />
    </>
  )
}
