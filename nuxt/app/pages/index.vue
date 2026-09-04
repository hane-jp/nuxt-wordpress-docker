<script setup lang="ts">
import type { PostSummary } from '#shared/types/post'

const config = useRuntimeConfig()
const { data: posts, error, status } = await useFetch<PostSummary[]>('/api/posts')

usePageSeo({
  title: 'Nuxt × WordPress Starter',
  description: 'NuxtとWordPress REST APIをDockerで連携するスタータープロジェクトです。'
})
</script>

<template>
  <main>
    <section class="hero">
      <div class="shell hero__grid">
        <div>
          <p class="eyebrow">Nuxt 4 × WordPress × Docker</p>
          <h1><span>ヘッドレスCMSを、</span><span>すぐ試せるスターター。</span></h1>
          <p class="lead">WordPressで投稿を管理し、Nuxtで高速に表示する最小構成です。下のサンプル投稿でREST API連携を確認できます。</p>
          <div class="actions">
            <NuxtLink to="/posts" class="button">投稿サンプルを見る</NuxtLink>
            <NuxtLink to="/guide" class="button button--ghost">使い方ガイド</NuxtLink>
            <a href="http://localhost:8080/wp-admin" class="button button--ghost" target="_blank" rel="noreferrer">WordPress管理画面</a>
          </div>
        </div>
        <aside class="connection-card">
          <span class="connection-card__label">API connection</span>
          <strong v-if="status === 'pending'">確認中…</strong>
          <strong v-else-if="error" class="status-error">未接続</strong>
          <strong v-else class="status-ok">接続済み</strong>
          <code>{{ config.public.wpApiBase }}</code>
          <p v-if="error">WordPressを起動・初期設定すると投稿が表示されます。</p>
          <p v-else>{{ posts?.length ?? 0 }}件の投稿を取得しました。</p>
        </aside>
      </div>
    </section>

    <section class="section shell">
      <div class="section-heading">
        <div>
          <p class="eyebrow">Latest posts</p>
          <h2>WordPressから取得した投稿</h2>
        </div>
        <NuxtLink to="/posts" class="text-link">すべて見る →</NuxtLink>
      </div>
      <div v-if="status === 'pending'" class="notice">投稿を読み込んでいます…</div>
      <div v-else-if="error" class="notice notice--error">
        <strong>まだ投稿を取得できません</strong>
        <p>WordPressを起動して初期設定を済ませてください。この画面はAPI未接続でも安全に表示されます。</p>
      </div>
      <div v-else-if="!posts?.length" class="notice">
        <strong>投稿はまだありません</strong>
        <p>WordPress管理画面から最初の記事を公開してみましょう。</p>
      </div>
      <div v-else class="post-grid">
        <PostCard v-for="post in posts.slice(0, 3)" :key="post.id" :post="post" />
      </div>
    </section>
  </main>
</template>
