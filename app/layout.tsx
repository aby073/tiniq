import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'SkySolve — Uzum uchun AI mahsulot yordamchisi',
  description:
    'Mahsulot rasmini yuklang, uning foydalari va xususiyatlarini aniqlang yoki Uzum Market uchun professional reklama fotosi yarating.',
  generator: 'SkySolve',
  metadataBase: new URL('https://skysolve.vercel.app'),
  openGraph: {
    title: 'SkySolve — Uzum uchun AI yordamchi',
    description: 'Mahsulotingiz uchun professional foto va tayyor opisaniya yarating.',
    type: 'website',
    locale: 'uz_UZ',
  },
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#201e19',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="uz" className={`dark ${inter.variable} bg-background`}>
      <body className="font-sans antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
