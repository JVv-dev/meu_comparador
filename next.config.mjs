// Conteúdo para: meu_comparador_frontend/next.config.mjs
// (v11.11 - CORREÇÃO FINAL de sintaxe do CSP)

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'img.terabyteshop.com.br' },
      { protocol: 'https', hostname: 'hotsite.pichau.com.br' },
      { protocol: 'https', hostname: 'hotsite.kabum.com.br' },
      { protocol: 'https', hostname: 'img.kabum.com.br' }, 
      { protocol: 'https', hostname: 'img.pichau.com.br' },
      { protocol: 'https', hostname: 'vercel.com' }, // Para o avatar da Vercel
    ],
  },

  // --- CABEÇALHO CSP CORRIGIDO ---
  async headers() {
    
    // Lista de domínios permitidos para imagens
    const imageSources = [
      "'self'",
      "data:",
      "https://*.vercel-insights.com", 
      "https://*.vercel.live", 
      "https://vercel.com", // Para o avatar da Vercel
      
      // Domínios da Descrição e Principais
      "https://*.terabyteshop.com.br", 
      "https://*.pichau.com.br", 
      "https://*.kabum.com.br", 

      // AdSense
      "https://googleads.g.doubleclick.net", 
      "https://pagead2.googlesyndication.com", 
    ];
    
    // Lista de domínios permitidos para scripts
    const scriptSources = [
      "'self'",
      "'unsafe-eval'",
      "'unsafe-inline'", 
      "https://www.googletagmanager.com",
      "https://pagead2.googlesyndication.com",
      "https://vercel.live",
      "https://*.vercel-insights.com", // Analytics
    ];

    // Lista de domínios permitidos para estilos
    const styleSources = [
      "'self'",
      "'unsafe-inline'", // Pichau precisa disso
      "https://fonts.googleapis.com",
      "https_://*.pichau.com.br", // Permite CSS da descrição Pichau
    ];

    // Lista de domínios permitidos para conexão (API, etc)
    const connectSources = [
      "'self'",
      "https://api-comparador-backend.onrender.com", // Sua API
      "https://vitals.vercel-insights.com", 
      "https://vercel.live",
      "https://*.googleads.g.doubleclick.net", 
      "https://*.googlesyndication.com", 
    ];

    const fontSources = [
      "'self'",
      "https://fonts.gstatic.com",
    ];

    const frameSources = [
      "'self'",
      "https://vercel.live",
      "https://googleads.g.doubleclick.net",
      "https://pagead2.googlesyndication.com",
    ];

    // Remove todos os erros de 'https_://'
    const cspHeader = [
      `default-src 'self'`,
      `script-src ${scriptSources.join(' ')}`,
      `style-src ${styleSources.join(' ')}`,
      `img-src ${imageSources.join(' ')}`,
      `connect-src ${connectSources.join(' ')}`,
      `font-src ${fontSources.join(' ')}`,
      `frame-src ${frameSources.join(' ')}`,
      `object-src 'none'`,
      `base-uri 'self'`,
      `form-action 'self'`,
      `media-src 'self'`,
    ].join('; ').replace(/httpss?_?:\/\//g, 'https://'); // Garante que tudo seja https://

    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: cspHeader,
          },
        ],
      },
    ];
  },
  // --- FIM DA CORREÇÃO ---
};

export default nextConfig;