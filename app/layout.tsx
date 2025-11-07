import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import Script from 'next/script' 
import './globals.css'
// --- 1. Importe o ThemeProvider ---
import { ThemeProvider } from "@/components/theme-provider" 

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'price comparison',
  description: 'Encontre as melhores ofertas de placas de vídeo e mais!',
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
    <html lang="pt-BR" translate="no" suppressHydrationWarning> 
      <head>
        {/* O 'metadata' acima irá gerar a tag <meta> aqui */}
      </head>
      
      <Script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8958901962627606"
        crossOrigin="anonymous"
        strategy="afterInteractive" 
      />

      {/* --- 2. Adicione um fundo que FUNCIONA --- */}
      {/* slate-100 (Cinza claro) para Modo Claro
        slate-950 (Cinza quase-preto) para Modo Escuro
        Isso VAI ser diferente de branco/preto.
      */}
      <body 
        className={`
          font-sans antialiased notranslate 
          min-h-screen 
          bg-slate-100
          dark:bg-slate-950
        `}
      > 
        {/* --- 3. Ative o Provedor de Tema --- */}
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
          {children}
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  )
}