// Conteúdo para: meu_comparador_frontend/next.config.mjs

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.terabyteshop.com.br', // Para imagens da Terabyte
      },
      {
        protocol: 'https',
        hostname: 'hotsite.pichau.com.br', // Para imagens da Pichau
      },
      {
        protocol: 'https',
        hostname: 'hotsite.kabum.com.br', // Para imagens da Kabum (Boa adição!)
      },
    ],
  },
};

export default nextConfig;
