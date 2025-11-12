// postcss.config.mjs

/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    '@tailwindcss/postcss': {
      // --- INÍCIO DA MUDANÇA ---
      config: {
        plugins: [
          require('@tailwindcss/typography'), // <-- ADICIONE ESTA LINHA
        ],
      },
      // --- FIM DA MUDANÇA ---
    },
  },
}

export default config