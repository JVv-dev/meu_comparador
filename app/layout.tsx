import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import Script from 'next/script' 
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'GPU price',
  description: 'Encontre as melhores ofertas de placas de vídeo e mais!',
  other: { 
    "google": "notranslate" // (Isto está correto e deve ser mantido)
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" translate="no"> 
      <head>
        {/* O 'metadata' acima irá gerar a tag <meta> aqui */}
      </head>
      
      <Script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8958901962627606"
        crossOrigin="anonymous"
        strategy="afterInteractive" 
      />

      {/* === A MUDANÇA ESTÁ AQUI === */}
      <body 
        className={`
          font-sans antialiased notranslate 
          min-h-screen 
          bg-gradient-to-b from-slate-50 to-slate-100
          dark:from-slate-900 dark:to-slate-950
        `}
      >
        {children}
        <Analytics />
      </body>
    </html>
  )
}