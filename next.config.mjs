// Conteúdo para: meu_comparador_frontend/next.config.mjs
// (v11.12 - Correção CSP Final com Wildcards)

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // Domínios principais
      { protocol: 'https', hostname: 'img.kabum.com.br' }, 
      { protocol: 'https', hostname: 'img.pichau.com.br' },
      { protocol: 'https', hostname: 'img.terabyteshop.com.br' },
      // Domínios da descrição
      { protocol: 'https', hostname: 'hotsite.pichau.com.br' },
      { protocol: 'https', hostname: 'hotsite.kabum.com.br' },
      // Outros
      { protocol: 'https', hostname: 'vercel.com' }, // Para o avatar da Vercel
    ],
  },

  // --- CABEÇALHO CSP CORRIGIDO (v11.12) ---
  async headers() {
    
    // Lista de domínios permitidos para imagens
    const imageSources = [
      "'self'",
      "data:",
      "https://*.vercel-insights.com", 
      "https://*.vercel.live", 
      "https://vercel.com", // Para o avatar da Vercel
      "https://*.googleads.g.doubleclick.net", 
      "https://*.googlesyndication.com", 
      // Wildcards para cobrir TODOS os subdomínios
      "https://*.kabum.com.br", 
      "https://*.pichau.com.br", 
      "https://*.terabyteshop.com.br", 
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
      "'unsafe-inline'", // Pichau/Shadcn precisa disso
      "https://fonts.googleapis.com",
      "https://*.pichau.com.br", // Permite CSS da descrição Pichau
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
    ].join('; '); // Removido o .replace() desnecessário

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