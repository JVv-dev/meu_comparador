import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import Script from 'next/script' // <-- 1. IMPORTE O COMPONENTE SCRIPT
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'GPU price',
  description: 'Encontre as melhores ofertas de placas de vídeo e mais!',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      {/* 2. ADICIONE O SCRIPT DO ADSENSER AQUI */}
      <Script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8958901962627606"
        crossOrigin="anonymous"
        strategy="afterInteractive" // Carrega depois que a página ficar interativa
      />
      <body className={`font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}