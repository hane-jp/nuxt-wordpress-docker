<script setup lang="ts">
usePageSeo({
  title: 'User Guide | Nuxt × WordPress Starter',
  description: 'Learn how to set up, publish, and customize the starter.',
  locale: 'en_US'
})
useHead({ htmlAttrs: { lang: 'en' } })
const config = useRuntimeConfig()
</script>

<template>
  <main class="section shell shell--article">
    <NuxtLink to="/" class="back-link">← Back to home</NuxtLink>
    <nav class="language-switcher" aria-label="Language"><NuxtLink to="/guide" lang="ja">日本語</NuxtLink><span aria-current="page">English</span></nav>
    <header class="guide-heading">
      <p class="eyebrow">Getting started</p><h1>User Guide</h1>
      <p>Learn the basic workflow for managing content in WordPress and displaying it with Nuxt.</p>
    </header>
    <nav class="guide-toc" aria-label="On this page">
      <strong>On this page</strong>
      <ol><li><a href="#start">Start the services</a></li><li><a href="#publish">Publish a post</a></li><li><a href="#confirm">View it in Nuxt</a></li><li><a href="#customize">Customize the UI</a></li><li><a href="#commands">Common commands</a></li><li><a href="#troubleshooting">Troubleshooting</a></li></ol>
    </nav>
    <div class="guide-content">
      <section id="start">
        <span class="guide-step">01</span><h2>Start the services</h2>
        <p>Prepare the environment file in the project root, then start Docker Compose.</p>
        <pre><code>cp .env.example .env</code><br><code>docker compose up -d</code></pre>
        <div class="guide-links"><a href="http://localhost:3000" target="_blank" rel="noreferrer"><strong>Nuxt</strong><span>localhost:3000</span></a><a href="http://localhost:8080/wp-admin" target="_blank" rel="noreferrer"><strong>WordPress Admin</strong><span>localhost:8080/wp-admin</span></a></div>
      </section>
      <section id="publish">
        <span class="guide-step">02</span><h2>Publish a post in WordPress</h2>
        <ol><li>In WordPress Admin, open Posts and select Add New Post.</li><li>Add a title, body, excerpt, and featured image.</li><li>Select Publish. Draft posts are not shown in the Nuxt post list.</li></ol>
        <p class="guide-tip"><strong>Tip:</strong> Include headings, lists, links, and images to check all of the article styles at once.</p>
      </section>
      <section id="confirm">
        <span class="guide-step">03</span><h2>View the post in Nuxt</h2>
        <p>Open the <NuxtLink to="/posts">post sample</NuxtLink> to see published posts. Select a card to open its detail page.</p>
        <dl class="guide-definition"><div><dt>REST API</dt><dd><code>{{ config.public.wpApiBase }}</code></dd></div><div><dt>Post list</dt><dd><code>nuxt/app/pages/posts/index.vue</code></dd></div><div><dt>Post detail</dt><dd><code>nuxt/app/pages/posts/[slug].vue</code></dd></div><div><dt>Server API</dt><dd><code>nuxt/server/api/posts/</code></dd></div></dl>
      </section>
      <section id="customize">
        <span class="guide-step">04</span><h2>Customize the UI</h2>
        <p>Edit <code>nuxt/app/components/PostCard.vue</code> for post cards and <code>nuxt/app/assets/scss/main.scss</code> for shared styles.</p>
        <p>WordPress response mapping and HTML sanitization live in <code>nuxt/server/utils/wordpress.ts</code>.</p>
      </section>
      <section id="commands">
        <span class="guide-step">05</span><h2>Common commands</h2>
        <div class="command-list"><div><code>docker compose up -d</code><span>Start all services</span></div><div><code>docker compose down</code><span>Stop all services</span></div><div><code>docker compose logs -f</code><span>Follow service logs</span></div><div><code>npm test</code><span>Run unit tests</span></div><div><code>npm run build</code><span>Verify the production build</span></div></div>
      </section>
      <section id="troubleshooting">
        <span class="guide-step">06</span><h2>Troubleshooting</h2>
        <ul><li>Check that “API connection” on the home page says connected.</li><li>Run <code>docker compose ps</code> and confirm every service is <code>healthy</code>.</li><li>Confirm that the WordPress post is published, not a draft.</li><li>If changes are not visible, run <code>docker compose restart nuxt</code>.</li></ul>
      </section>
    </div>
  </main>
</template>
