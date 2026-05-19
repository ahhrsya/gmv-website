import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Global Minang Ventura — From Minang to the World',
  description:
    'Global Minang Ventura is a venture capital firm and the official licensed partner of Restoran Sederhana — scaling authentic Padang cuisine to international markets through brand licensing, operational standards, and cultural integrity.',
  keywords: 'Global Minang Ventura, Padang Sederhana, Minang cuisine, Indonesian food, brand licensing, F&B expansion, Singapore, Australia, Sydney',
  authors: [{ name: 'Global Minang Ventura' }],
  openGraph: {
    title: 'Global Minang Ventura — From Minang to the World',
    description: 'The official licensed partner of Restoran Sederhana, scaling authentic Padang cuisine globally.',
    type: 'website',
    locale: 'en_US',
    siteName: 'Global Minang Ventura',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Global Minang Ventura — From Minang to the World',
    description: 'Scaling authentic Padang cuisine to international markets.',
  },
  robots: { index: true, follow: true },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
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
      </head>
      <body>{children}</body>
    </html>
  )
}
