<script setup lang="ts">
import type { PostDetail } from '#shared/types/post'

const route = useRoute()
const { data: post, error } = await useFetch<PostDetail>(() => `/api/posts/${route.params.slug}`)

if (error.value?.statusCode === 404) {
  throw createError({ statusCode: 404, message: '投稿が見つかりませんでした。' })
}

const { canonicalUrl, imageUrl } = usePageSeo({
  title: () => post.value ? `${post.value.title} | Nuxt × WordPress Starter` : '投稿 | Nuxt × WordPress Starter',
  description: () => post.value?.excerpt,
  image: () => post.value?.imageUrl,
  type: 'article',
  publishedTime: () => post.value?.publishedAt
})

useHead(() => post.value ? {
  script: [{
    key: 'article-jsonld',
    type: 'application/ld+json',
    textContent: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: post.value.title,
      description: post.value.excerpt,
      datePublished: post.value.publishedAt,
      image: imageUrl.value,
      mainEntityOfPage: canonicalUrl.value
    }).replace(/</g, '\\u003c')
  }]
} : {})
</script>

<template>
  <main class="section shell shell--article">
    <NuxtLink to="/posts" class="back-link">← 投稿一覧へ戻る</NuxtLink>
    <div v-if="error" class="notice notice--error">
      <strong>投稿を取得できませんでした</strong>
      <p>WordPressの接続状態を確認してください。</p>
    </div>
    <article v-else-if="post" class="article">
      <header class="article__header">
        <p class="eyebrow">WordPress post</p>
        <h1>{{ post.title }}</h1>
        <time :datetime="post.publishedAt">{{ formatDate(post.publishedAt) }}</time>
      </header>
      <img v-if="post.imageUrl" class="article__cover" :src="post.imageUrl" :alt="post.imageAlt">
      <!-- Content is sanitized by the server API before rendering. -->
      <div class="article__content" v-html="post.content" />
    </article>
  </main>
</template>
