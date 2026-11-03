# Changelog

## Unreleased

### Security and maintenance / セキュリティ・保守

- Update Nuxt to 4.6.4, with the required Nitro 2.13.6 and unrouting 0.3.2 security fixes. The lockfile also includes the corresponding builder and required transitive dependency changes; unrelated dependencies retain their previous resolved versions. See [Nuxt 4.6.4](https://github.com/nuxt/nuxt/releases/tag/v4.6.4) and [Nitro GHSA-39r7-wfcx-99xg](https://github.com/nitrojs/nitro/security/advisories/GHSA-39r7-wfcx-99xg).
- Nuxt 4.6.4と対応builder、必須の推移依存へ限定更新しました。開発時のworkspace境界・経路ルール・サーバー応答キャッシュ等の公式修正を取り込みます。更新したソースで `cd nuxt && npm ci` を実行してください。Node.js・WordPress・PHP・DBの対応範囲は変わりません。
- Keep the existing glob/minimatch compatibility probe runnable with Nitro's required archiver 8 API and document the removed archiver-utils dependency path. The remaining glob/minimatch advisories are unresolved.
- Update node-forge from 1.4.0 to 1.4.1 in the committed lockfile to include the upstream RSA signature verification fix ([#13](https://github.com/hane-jp/nuxt-wordpress-docker/pull/13), [GHSA-2g46-22mc-6gwp](https://github.com/digitalbazaar/forge/security/advisories/GHSA-2g46-22mc-6gwp)).
- node-forgeを1.4.0から1.4.1へ更新しました。変更はlockfileの該当エントリのみです。Node.jsの対応範囲とアプリのAPIは変わりません。更新したソースで `cd nuxt && npm ci` を実行してください。
- brace-expansion 2.1.7 / 5.0.12 were already included in v1.1.1; they are not new changes in #13. これらのbrace-expansion修正版はv1.1.1時点で含まれています。

### Known issues / 残る課題

- [#15](https://github.com/hane-jp/nuxt-wordpress-docker/pull/15) adds glob/minimatch investigation notes and synthetic compatibility checks only; it does not update dependencies. [GHSA-3g3m-2fjr-6pw4](https://github.com/advisories/GHSA-3g3m-2fjr-6pw4) and [GHSA-g3hv-75wg-m249](https://github.com/advisories/GHSA-g3hv-75wg-m249) remain unresolved.
- glob/minimatchは調査・検証追加のみで、対象2件のGHSAは未解決です。node-forgeの更新は全依存の脆弱性解消を意味しません。詳細と再実行手順は[調査記録](docs/security/2026-11-01-glob-minimatch.md)を参照してください。

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
