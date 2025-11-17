/** @type {import('next').NextConfig} */
const nextConfig = {
  // --- INÍCIO DA MUDANÇA (AUTORIZAR IMAGENS) ---
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.terabyteshop.com.br',
        port: '',
        pathname: '/archive/**',
      },
      {
        protocol: 'https',
        hostname: 'hotsite.pichau.com.br',
        port: '',
        pathname: '/descricao/**',
      },
      {
        protocol: 'https',
        hostname: 'hotsite.kabum.com.br',
        port: '',
        pathname: '/descricao/**',
      },
    ],
  },
  // --- FIM DA MUDANÇA ---
};

export default nextConfig;