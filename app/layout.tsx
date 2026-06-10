import type { Metadata } from 'next'
import Script from 'next/script'
import './globals.css'
import { content } from '@/lib/content'

const ga4Id = (content as any).ga4_id || ''
const fbPixelId = (content as any).fb_pixel_id || ''

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
      <body>
        {children}

        {/* Google Analytics 4 — injected only when GA4 ID is set in CMS */}
        {ga4Id && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${ga4Id}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${ga4Id}');
              `}
            </Script>
          </>
        )}

        {/* Facebook Pixel — injected only when Pixel ID is set in CMS */}
        {fbPixelId && (
          <Script id="facebook-pixel" strategy="afterInteractive">
            {`
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${fbPixelId}');
              fbq('track', 'PageView');
            `}
          </Script>
        )}
      </body>
    </html>
  )
}
