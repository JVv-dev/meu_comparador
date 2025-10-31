import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import Script from 'next/script' // Importe o Script
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'GPU price',
  description: 'Encontre as melhores ofertas de placas de vídeo e mais!',
  // === 1. Adiciona a meta tag para o Google não traduzir ===
  other: { 
    "google": "notranslate"
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    // === 2. Adiciona lang="pt-BR" e translate="no" ===
    <html lang="pt-BR" translate="no"> 
      <head>
        {/* O 'metadata' acima irá gerar a tag <meta> aqui */}
      </head>
      
      {/* 3. Script do AdSense (mantido) */}
      <Script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8958901962627606"
        crossOrigin="anonymous"
        strategy="afterInteractive" 
      />
      <body className={`font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}