/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'img.kabum.com.br' }, 
      { protocol: 'https', hostname: 'img.pichau.com.br' },
      { protocol: 'https', hostname: 'img.terabyteshop.com.br' },
      { protocol: 'https', hostname: 'hotsite.pichau.com.br' },
      { protocol: 'https', hostname: 'hotsite.kabum.com.br' },
      { protocol: 'https', hostname: 'vercel.com' },
    ],
  },

  async headers() {
    const imageSources = [
      "'self'",
      "data:",
      "https://*.vercel-insights.com", 
      "https://*.vercel.live", 
      "https://vercel.com",
      "https://*.googleads.g.doubleclick.net", 
      "https://*.googlesyndication.com", 
      "https://*.kabum.com.br", 
      "https://*.pichau.com.br", 
      "https://*.terabyteshop.com.br", 
    ];
    
    const scriptSources = [
      "'self'",
      "'unsafe-eval'",
      "'unsafe-inline'", 
      "https://www.googletagmanager.com",
      "https://pagead2.googlesyndication.com",
      "https://vercel.live",
      "https://*.vercel-insights.com",
      "https://va.vercel-scripts.com"
    ];

    const styleSources = [
      "'self'",
      "'unsafe-inline'",
      "https://fonts.googleapis.com",
      "https://*.pichau.com.br",
    ];

    // --- CORREÇÃO CRÍTICA AQUI: ADICIONADO LOCALHOST ---
    const connectSources = [
      "'self'",
      "https://api-comparador-backend.onrender.com",
      "http://localhost:5001", // Permite Backend Local
      "http://127.0.0.1:5001", // Permite Backend Local (IP)
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
    ].join('; ');

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