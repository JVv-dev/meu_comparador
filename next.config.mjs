// Conteúdo para: meu_comparador_frontend/next.config.mjs
// (v11.5 - CORREÇÃO DO ERRO DE SINTAXE '->//')

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'img.terabyteshop.com.br' },
      { protocol: 'https', hostname: 'hotsite.pichau.com.br' },
      { protocol: 'https', hostname: 'hotsite.kabum.com.br' },
      { protocol: 'https', hostname: 'img.kabum.com.br' }, 
      { protocol: 'https', hostname: 'img.pichau.com.br' },
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
      
      // Domínios da Descrição
      "https://img.terabyteshop.com.br", 
      "https://hotsite.pichau.com.br", 
      "https://hotsite.kabum.com.br", 
      
      // DOMÍNIOS PRINCIPAIS (CORRIGIDOS)
      "https://img.kabum.com.br",
      "https://img.pichau.com.br",

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
    ];

    // Lista de domínios permitidos para estilos
    const styleSources = [
      "'self'",
      "'unsafe-inline'", // Pichau precisa disso
      "https://fonts.googleapis.com",
    ];

    // Lista de domínios permitidos para conexão (API, etc)
    const connectSources = [
      "'self'",
      "https://api-comparador-backend.onrender.com", // Sua API
      "https://vitals.vercel-insights.com", // Vercel
      "https://vercel.live",
      "https://googleads.g.doubleclick.net", 
      "https://pagead2.googlesyndication.com", 
    ];

    const cspHeader = [
      `default-src 'self'`,
      `script-src ${scriptSources.join(' ')}`,
      `style-src ${styleSources.join(' ')}`,
      `img-src ${imageSources.join(' ')}`,
      `connect-src ${connectSources.join(' ')}`,
      `font-src 'self' https://fonts.gstatic.com`,
      `frame-src 'self' https://vercel.live https://googleads.g.doubleclick.net https://pagead2.googlesyndication.com`,
      `object-src 'none'`,
      `base-uri 'self'`,
      `form-action 'self'`,
      `media-src 'self'`,
    ].join('; ');

    return [
      {
        // Aplica esta política em TODAS as rotas do site
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