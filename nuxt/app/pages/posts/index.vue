<script setup lang="ts">
import type { PostSummary } from '#shared/types/post'

const { data: posts, error, status, refresh } = await useFetch<PostSummary[]>('/api/posts')
usePageSeo({
  title: '投稿一覧 | Nuxt × WordPress Starter',
  description: 'WordPress REST APIから取得した公開済みの投稿一覧です。'
})
</script>

<template>
  <main class="section shell">
    <NuxtLink to="/" class="back-link">← トップへ戻る</NuxtLink>
    <div class="page-heading">
      <p class="eyebrow">WordPress REST API</p>
      <h1>投稿サンプル</h1>
      <p>公開済みのWordPress投稿をREST API経由で表示しています。</p>
    </div>
    <div v-if="status === 'pending'" class="notice">投稿を読み込んでいます…</div>
    <div v-else-if="error" class="notice notice--error">
      <strong>WordPress APIに接続できませんでした</strong>
      <p>Dockerの起動状態と環境変数を確認して、もう一度お試しください。</p>
      <button class="button" type="button" @click="refresh()">再読み込み</button>
    </div>
    <div v-else-if="!posts?.length" class="notice">
      <strong>公開済みの投稿がありません</strong>
      <p>WordPress管理画面で投稿を公開すると、ここに表示されます。</p>
      <a href="http://localhost:8080/wp-admin/post-new.php" class="button" target="_blank" rel="noreferrer">投稿を作成する</a>
    </div>
    <div v-else class="post-grid">
      <PostCard v-for="post in posts" :key="post.id" :post="post" />
    </div>
  </main>
</template>
