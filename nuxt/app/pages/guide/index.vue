<script setup lang="ts">
useSeoMeta({ title: '使い方ガイド | Nuxt × WordPress Starter', description: 'セットアップ、投稿、カスタマイズ方法を説明します。' })
useHead({ htmlAttrs: { lang: 'ja' } })
const config = useRuntimeConfig()
</script>

<template>
  <main class="section shell shell--article">
    <NuxtLink to="/" class="back-link">← トップへ戻る</NuxtLink>
    <nav class="language-switcher" aria-label="言語切り替え"><span aria-current="page">日本語</span><NuxtLink to="/guide/en" lang="en">English</NuxtLink></nav>
    <header class="guide-heading">
      <p class="eyebrow">Getting started</p><h1>使い方ガイド</h1>
      <p>WordPressでコンテンツを管理し、Nuxtで表示するまでの基本操作をまとめています。</p>
    </header>
    <nav class="guide-toc" aria-label="ページ内メニュー">
      <strong>このページの内容</strong>
      <ol><li><a href="#start">サービスを起動する</a></li><li><a href="#publish">投稿を公開する</a></li><li><a href="#confirm">Nuxtで確認する</a></li><li><a href="#customize">画面をカスタマイズする</a></li><li><a href="#commands">よく使うコマンド</a></li><li><a href="#troubleshooting">うまく表示されないとき</a></li></ol>
    </nav>
    <div class="guide-content">
      <section id="start">
        <span class="guide-step">01</span><h2>サービスを起動する</h2>
        <p>プロジェクトのルートで環境変数を用意し、Docker Composeを起動します。</p>
        <pre><code>cp .env.example .env</code><br><code>docker compose up -d</code></pre>
        <div class="guide-links"><a href="http://localhost:3000" target="_blank" rel="noreferrer"><strong>Nuxt</strong><span>localhost:3000</span></a><a href="http://localhost:8080/wp-admin" target="_blank" rel="noreferrer"><strong>WordPress管理画面</strong><span>localhost:8080/wp-admin</span></a></div>
      </section>
      <section id="publish">
        <span class="guide-step">02</span><h2>WordPressで投稿を公開する</h2>
        <ol><li>WordPress管理画面の「投稿」から「新規投稿を追加」を選びます。</li><li>タイトル、本文、抜粋、アイキャッチ画像を設定します。</li><li>右上の「公開」を押します。下書きはNuxtの一覧には表示されません。</li></ol>
        <p class="guide-tip"><strong>ヒント：</strong>見出し、リスト、リンク、画像を含めると本文スタイルも確認できます。</p>
      </section>
      <section id="confirm">
        <span class="guide-step">03</span><h2>Nuxtで投稿を確認する</h2>
        <p><NuxtLink to="/posts">投稿サンプル</NuxtLink>で公開済み投稿を確認できます。カードを選ぶと詳細ページへ移動します。</p>
        <dl class="guide-definition"><div><dt>REST API</dt><dd><code>{{ config.public.wpApiBase }}</code></dd></div><div><dt>一覧ページ</dt><dd><code>nuxt/app/pages/posts/index.vue</code></dd></div><div><dt>詳細ページ</dt><dd><code>nuxt/app/pages/posts/[slug].vue</code></dd></div><div><dt>サーバーAPI</dt><dd><code>nuxt/server/api/posts/</code></dd></div></dl>
      </section>
      <section id="customize">
        <span class="guide-step">04</span><h2>画面をカスタマイズする</h2>
        <p>投稿カードは <code>nuxt/app/components/PostCard.vue</code>、共通スタイルは <code>nuxt/app/assets/scss/main.scss</code> から変更できます。</p>
        <p>REST APIのレスポンス変換とHTMLサニタイズは <code>nuxt/server/utils/wordpress.ts</code> に集約しています。</p>
      </section>
      <section id="commands">
        <span class="guide-step">05</span><h2>よく使うコマンド</h2>
        <div class="command-list"><div><code>docker compose up -d</code><span>すべてのサービスを起動</span></div><div><code>docker compose down</code><span>サービスを停止</span></div><div><code>docker compose logs -f</code><span>ログを確認</span></div><div><code>npm test</code><span>ユニットテストを実行</span></div><div><code>npm run build</code><span>本番ビルドを確認</span></div></div>
      </section>
      <section id="troubleshooting">
        <span class="guide-step">06</span><h2>うまく表示されないとき</h2>
        <ul><li>トップの「API connection」が接続済みか確認します。</li><li><code>docker compose ps</code> ですべてのサービスが <code>healthy</code> か確認します。</li><li>WordPressの投稿が「公開」状態になっているか確認します。</li><li>反映されない場合は <code>docker compose restart nuxt</code> を実行します。</li></ul>
      </section>
    </div>
  </main>
</template>
