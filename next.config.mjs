// Conteúdo para: meu_comparador_frontend/next.config.mjs
// (v11.3 - Autorizando Imagens com CSP)

/** @type {import('next').NextConfig} */
const nextConfig = {
  // O 'images.remotePatterns' não funciona para <img>,
  // mas vamos manter caso você use o <Image> do Next no futuro.
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'img.terabyteshop.com.br' },
      { protocol: 'https', hostname: 'hotsite.pichau.com.br' },
      { protocol: 'https', hostname: 'hotsite.kabum.com.br' },
    ],
  },

  // --- INÍCIO DA CORREÇÃO (CSP HEADER) ---
  // Isso diz ao navegador para PERMITIR imagens e estilos
  // de outros domínios, mesmo dentro do dangerouslySetInnerHTML.
  async headers() {
    
    // Lista de domínios permitidos para imagens
    const imageSources = [
      "'self'",
      "data:",
      "https://*.vercel-insights.com", // Vercel Analytics
      "https://*.vercel.live", // Vercel
      "https://img.terabyteshop.com.br", // Terabyte
      "https://hotsite.pichau.com.br", // Pichau
      "https://hotsite.kabum.com.br", // Kabum
      "https://googleads.g.doubleclick.net", // AdSense
      "https://pagead2.googlesyndication.com", // AdSense
    ];
    
    // Lista de domínios permitidos para scripts
    const scriptSources = [
      "'self'",
      "'unsafe-eval'",
      "'unsafe-inline'", // Necessário para AdSense e outros
      "https://www.googletagmanager.com",
      "https://pagead2.googlesyndication.com",
      "https://vercel.live",
    ];

    // Lista de domínios permitidos para estilos
    const styleSources = [
      "'self'",
      "'unsafe-inline'", // Pichau precisa disso para carregar imagens via <style>
      "https://fonts.googleapis.com",
    ];

    // Lista de domínios permitidos para conexão (API, etc)
    const connectSources = [
      "'self'",
      "https://api-comparador-backend.onrender.com", // Sua API
      "https://vitals.vercel-insights.com", // Vercel
      "https://vercel.live",
      "https://googleads.g.doubleclick.net", // AdSense
      "https://pagead2.googlesyndication.com", // AdSense
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