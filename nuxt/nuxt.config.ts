export default defineNuxtConfig({
  css: ['@/assets/scss/main.scss'],

  devtools: {
    enabled: process.env.NODE_ENV === 'development'
  },

  runtimeConfig: {
    wpApiBase: process.env.NUXT_WP_API_BASE || 'http://localhost:8080/wp-json',
    public: {
      wpApiBase: process.env.NUXT_PUBLIC_WP_API_BASE || 'http://localhost:8080/wp-json',
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    }
  },

  app: {
    head: {
      htmlAttrs: { lang: 'ja' },
      meta: [
        { name: 'theme-color', content: '#2563eb' },
        { name: 'format-detection', content: 'telephone=no' }
      ],
      link: [
        { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' }
      ]
    }
  },

  typescript: {
    strict: true
  },

  compatibilityDate: '2026-08-28'
})
