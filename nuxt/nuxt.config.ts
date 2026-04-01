export default defineNuxtConfig({
  css: ['@/assets/scss/main.scss'],

  devtools: {
    enabled: true
  },

  runtimeConfig: {
    public: {
      wpApiBase: process.env.NUXT_PUBLIC_WP_API_BASE || 'http://localhost:8080/wp-json'
    }
  },

  typescript: {
    strict: true
  },

  nitro: {
    compatibilityDate: '2024-04-03'
  }
})
