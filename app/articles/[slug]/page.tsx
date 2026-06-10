import { notFound } from 'next/navigation'
import { promises as fs } from 'fs'
import path from 'path'
import ArticleContent from './ArticleContent'
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

export const dynamicParams = false

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

  return <ArticleContent article={article} related={related} />
}
