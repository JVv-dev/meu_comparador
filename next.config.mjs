// Conteúdo para: meu_comparador_frontend/next.config.mjs
// (v11.9 - Correção Final da Política de Segurança)

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

  async headers() {
    
    // Lista de domínios permitidos para imagens
    const imageSources = [
      "'self'",
      "data:",
      "https_://*.vercel-insights.com", 
      "https_://*.vercel.live", 
      "https://img.terabyteshop.com.br", 
      "https://hotsite.pichau.com.br", 
      "https://hotsite.kabum.com.br", 
      "https://img.kabum.com.br",
      "https://img.pichau.com.br",
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

    // --- INÍCIO DA CORREÇÃO (v11.9) ---
    // Lista de domínios permitidos para estilos
    const styleSources = [
      "'self'",
      "'unsafe-inline'", // Necessário para o `shadcn/ui` e `next-themes`
      "https_://fonts.googleapis.com",
      
      // Adiciona os domínios de imagem aqui também (para o CSS da Pichau)
      "https://hotsite.pichau.com.br",
      "https://img.terabyteshop.com.br", 
      "https://hotsite.kabum.com.br", 
      "https://img.kabum.com.br",
      "https://img.pichau.com.br",
    ];
    // --- FIM DA CORREÇÃO ---

    // Lista de domínios permitidos para conexão (API, etc)
    const connectSources = [
      "'self'",
      "https://api-comparador-backend.onrender.com", // Sua API
      "https_://vitals.vercel-insights.com", // Vercel
      "https_://vercel.live",
      "https://googleads.g.doubleclick.net", 
      "https://pagead2.googlesyndication.com", 
    ];

    const cspHeader = [
      `default-src 'self'`,
      `script-src ${scriptSources.join(' ')}`,
      `style-src ${styleSources.join(' ')}`, // <-- A lista corrigida é usada aqui
      `img-src ${imageSources.join(' ')}`,
      `connect-src ${connectSources.join(' ')}`,
      `font-src 'self' https://fonts.gstatic.com`,
      `frame-src 'self' https_://vercel.live https://googleads.g.doubleclick.net https://pagead2.googlesyndication.com`,
      `object-src 'none'`,
      `base-uri 'self'`,
      `form-action 'self'`,
      `media-src 'self'`,
    ].join('; ').replace(/httpss?_?:\/\//g, 'https://'); // Garante que todos os erros de digitação sejam https://

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
  
};

export default nextConfig;