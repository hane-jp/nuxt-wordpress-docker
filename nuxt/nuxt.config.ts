export default defineNuxtConfig({
  css: ['@/assets/scss/main.scss'],

  devtools: {
    enabled: process.env.NODE_ENV === 'development'
  },

  runtimeConfig: {
    wpApiBase: process.env.NUXT_WP_API_BASE || 'http://localhost:8080/wp-json',
    public: {
      wpApiBase: process.env.NUXT_PUBLIC_WP_API_BASE || 'http://localhost:8080/wp-json'
    }
  },

  typescript: {
    strict: true
  },

  compatibilityDate: '2026-08-28'
})
