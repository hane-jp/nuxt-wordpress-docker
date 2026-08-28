<script setup lang="ts">
import type { PostSummary } from '#shared/types/post'

defineProps<{ post: PostSummary }>()
</script>

<template>
  <article class="post-card">
    <NuxtLink :to="`/posts/${post.slug}`" class="post-card__link">
      <div v-if="post.imageUrl" class="post-card__media">
        <img :src="post.imageUrl" :alt="post.imageAlt" loading="lazy">
      </div>
      <div v-else class="post-card__placeholder" aria-hidden="true">WP</div>
      <div class="post-card__body">
        <time :datetime="post.publishedAt">{{ formatDate(post.publishedAt) }}</time>
        <h2>{{ post.title }}</h2>
        <p>{{ post.excerpt || 'この記事には抜粋がありません。' }}</p>
        <span class="text-link">記事を読む <span aria-hidden="true">→</span></span>
      </div>
    </NuxtLink>
  </article>
</template>
