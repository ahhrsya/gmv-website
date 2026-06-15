import type { Metadata } from 'next'
import './globals.css'
import { content } from '@/lib/content'

const headScripts = (content as any).head_scripts || ''

const BASE_URL = 'https://global-minang-ventura.vercel.app'
const OG_IMAGE = `${BASE_URL}/assets/og-image.jpg`

export const metadata: Metadata = {
  title: 'Global Minang Ventura — From Minang to the World',
  description: 'Global Minang Ventura is a venture capital firm and the official licensed partner of Restoran Sederhana — scaling authentic Padang cuisine to international markets through brand licensing, operational standards, and cultural integrity.',
  keywords: 'Global Minang Ventura, Padang Sederhana, Minang cuisine, Indonesian food, brand licensing, F&B expansion, Singapore, Australia, Sydney',
  authors: [{ name: 'Global Minang Ventura' }],
  openGraph: {
    title: 'Global Minang Ventura — From Minang to the World',
    description: 'The official licensed partner of Restoran Sederhana, scaling authentic Padang cuisine globally.',
    type: 'website',
    locale: 'en_US',
    siteName: 'Global Minang Ventura',
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: 'Global Minang Ventura' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Global Minang Ventura — From Minang to the World',
    description: 'Scaling authentic Padang cuisine to international markets.',
    images: [OG_IMAGE],
  },
  robots: { index: true, follow: true },
}

const organizationSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${BASE_URL}/#organization`,
      name: 'Global Minang Ventura',
      url: `${BASE_URL}/`,
      logo: `${BASE_URL}/assets/logo.png`,
      description:
        'Venture capital firm and official licensed partner of Restoran Sederhana, scaling authentic Padang cuisine to international markets.',
      sameAs: ['https://instagram.com/sederhanaglobal'],
      contactPoint: {
        '@type': 'ContactPoint',
        email: 'globalminangventura@gmail.com',
        contactType: 'general',
      },
    },
    {
      '@type': 'WebSite',
      '@id': `${BASE_URL}/#website`,
      url: `${BASE_URL}/`,
      name: 'Global Minang Ventura',
      publisher: { '@id': `${BASE_URL}/#organization` },
    },
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        {headScripts && (
          <script dangerouslySetInnerHTML={{ __html: headScripts }} />
        )}
      </head>
      <body>{children}</body>
    </html>
  )
}
