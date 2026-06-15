import type { Metadata } from 'next'
import AboutPageClient from './AboutPageClient'

export const metadata: Metadata = {
  title: 'About Us — Global Minang Ventura',
  description: 'Global Minang Ventura is the official licensed partner of Restoran Sederhana, scaling authentic Padang cuisine to international markets through structured expansion, cultural integrity, and strategic partnerships.',
  openGraph: {
    title: 'About Us — Global Minang Ventura',
    description: 'The strategy, mission, and people behind GMV\'s global expansion of Padang cuisine.',
    type: 'website',
    locale: 'en_US',
    siteName: 'Global Minang Ventura',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Us — Global Minang Ventura',
    description: 'The strategy, mission, and people behind GMV\'s global expansion of Padang cuisine.',
  },
}

export default function AboutPage() {
  return <AboutPageClient />
}
