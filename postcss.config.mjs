// Conteúdo para: meu_comparador_frontend/postcss.config.mjs

/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    '@tailwindcss/postcss': {
      config: {
        plugins: [
          require('@tailwindcss/typography'), // Para formatar o HTML da descrição
        ],
      },
    },
  },
}

export default config