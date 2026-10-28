# Changelog

## 1.1.1

### Compatibility / 互換性の注意

- **Node.js >=24.22.1 <25 and npm >=11 are required.** Node.js 24.11.0 through 24.22.0, previously allowed by v1.1.0, are outside the supported range. Upgrade Node.js before running `npm ci`.
- **Node.js の最低版は24.22.1です。** v1.1.0のenginesで許容していたNode.js 24.11.0〜24.22.0は新しい対応範囲外です。`npm ci`の前にNode.jsを更新してください。
- Pin the Docker Nuxt service image and `.nvmrc` to Node.js 24.22.1.

### Security and maintenance

- Update Nuxt from 4.5.2 to 4.6.3, with the corresponding builders and committed lockfile.
- Include the resolved security and maintenance versions on main: Nuxt DevTools 3.4.4, Undici 8.12.3, shell-quote 1.11.0, serialize-javascript 7.1.3, and sanitize-html 2.18.1.
- Update Sass and Sass Embedded from 1.103.1 to 1.105.0, and Vitest to 4.1.12, with their resolved dependencies.

### Fixed

- Prevent double encoding of WordPress Japanese slugs in sitemap URLs. Post cards and the sitemap now share the same URL builder.
- WordPressの日本語スラッグがサイトマップ内で二重エンコードされる不具合を修正。投稿カードとサイトマップでURL生成処理を共通化しました。

### Documentation

- Document support for Unicode post slugs and recommend lowercase ASCII slugs for production operations.
