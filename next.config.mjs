// Conteúdo para: meu_comparador_frontend/next.config.mjs
// (v11.10 - Correção CSP Final com Wildcards)

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

  // --- CABEÇALHO CSP CORRIGIDO (v11.10) ---
  async headers() {
    
    // --- LISTAS CORRIGIDAS (sem erros de digitação) ---
    const imageSources = [
      "'self'",
      "data:",
      "https://*.vercel-insights.com", 
      "https://*.vercel.live", 
      "https://*.googleads.g.doubleclick.net", 
      "https://*.googlesyndication.com", 
      "https://*.kabum.com.br", // <-- Cobre img. e hotsite.
      "https://*.pichau.com.br", // <-- Cobre img. e hotsite.
      "https://*.terabyteshop.com.br", // <-- Cobre img.
    ];
    
    const scriptSources = [
      "'self'",
      "'unsafe-eval'",
      "'unsafe-inline'", 
      "https://www.googletagmanager.com",
      "https_://pagead2.googlesyndication.com",
      "https_://vercel.live",
    ];

    const styleSources = [
      "'self'",
      "'unsafe-inline'", // Necessário para Pichau e componentes
      "https://fonts.googleapis.com",
      "https_://*.pichau.com.br", // Permite CSS da descrição Pichau
    ];

    const connectSources = [
      "'self'",
      "https://api-comparador-backend.onrender.com", // Sua API
      "https://vitals.vercel-insights.com", 
      "https_://vercel.live",
      "https_://*.googleads.g.doubleclick.net", 
      "https_://*.googlesyndication.com", 
    ];

    const fontSources = [
      "'self'",
      "https://fonts.gstatic.com",
    ];

    const frameSources = [
      "'self'",
      "https://vercel.live",
      "https_://googleads.g.doubleclick.net",
      "https_://pagead2.googlesyndication.com",
    ];
    // --- FIM DAS LISTAS ---

    // Garante que todos os https_:// sejam https://
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
  // --- FIM DA CORREÇÃO ---
};

export default nextConfig;