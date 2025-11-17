// Conteúdo para: meu_comparador_frontend/next.config.mjs
// (v11.1 - Autorizando Imagens Externas)

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
      // Adicione aqui se a Kabum também tiver imagens na descrição
    ],
  },
  // --- FIM DA MUDANÇA ---
};

export default nextConfig;