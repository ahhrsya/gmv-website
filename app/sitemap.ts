import type { MetadataRoute } from 'next'
import articlesData from '@/public/articles-index.json'

const BASE_URL = 'https://global-minang-ventura.vercel.app'

interface ArticleMeta {
  slug: string
  date: string
  published: boolean
}

export default function sitemap(): MetadataRoute.Sitemap {
  const articles = (articlesData as ArticleMeta[]).filter(a => a.published)

  const articleRoutes: MetadataRoute.Sitemap = articles.map(article => ({
    url: `${BASE_URL}/articles/${article.slug}/`,
    lastModified: new Date(article.date),
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  return [
    {
      url: `${BASE_URL}/`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${BASE_URL}/about/`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/articles/`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    ...articleRoutes,
  ]
}
