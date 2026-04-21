import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'HEIC to JPG Converter — Free, Fast, Private',
  description:
    'Convert HEIC photos to JPG online for free. 100% client-side — your photos never leave your browser. Batch convert up to 20 files with quality control. No signup required.',
  keywords: [
    'heic to jpg',
    'convert heic',
    'heic converter',
    'heic to jpeg',
    'iphone photo converter',
    'free heic converter',
    'online heic converter',
  ],
  authors: [{ name: 'The App Factory' }],
  openGraph: {
    title: 'HEIC to JPG Converter — Free, Fast, Private',
    description:
      'Convert HEIC photos to JPG online for free. 100% private — files processed entirely in your browser.',
    type: 'website',
    siteName: 'HEIC to JPG',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HEIC to JPG Converter — Free, Fast, Private',
    description: 'Convert HEIC photos to JPG. 100% client-side, no uploads.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebApplication',
              name: 'HEIC to JPG Converter',
              description:
                'Free online HEIC to JPG converter. 100% client-side processing — your photos never leave your browser.',
              applicationCategory: 'UtilitiesApplication',
              operatingSystem: 'Any',
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'USD',
              },
              featureList: [
                'Batch HEIC to JPG conversion',
                'Client-side processing',
                'Quality control',
                'ZIP download',
                'No signup required',
              ],
            }),
          }}
        />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
