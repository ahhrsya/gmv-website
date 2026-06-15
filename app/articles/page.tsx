import type { Metadata } from 'next'
import ArticlesPageClient from './ArticlesPageClient'

export const metadata: Metadata = {
  title: 'Articles — Global Minang Ventura',
  description: 'Insights, news, and updates from Global Minang Ventura — the official licensed partner of Restoran Sederhana scaling authentic Padang cuisine to international markets.',
  openGraph: {
    title: 'Articles — Global Minang Ventura',
    description: 'Insights, news, and updates from Global Minang Ventura on Padang cuisine, brand expansion, and international F&B strategy.',
    type: 'website',
    locale: 'en_US',
    siteName: 'Global Minang Ventura',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Articles — Global Minang Ventura',
    description: 'Insights, news, and updates from Global Minang Ventura on Padang cuisine, brand expansion, and international F&B strategy.',
  },
}

export default function ArticlesPage() {
  return <ArticlesPageClient />
}
