# glob / minimatch 互換性調査（2026-11-01）

Refs #14。この変更は調査文書と小さな互換性テストのみ。依存とlockを更新しておらず、対象GHSAは未解消。アラートdismissや修正済み宣言はしない。

2026-11-03追記（#17）: 以下は11月1日の基点を記録した調査です。Nuxt 4.6.4が要求するNitro 2.13.6ではarchiver 8 / readdir-glob 3が必須になり、archiver-utilsとそのglob/minimatch経路が削除されます。検証スクリプトはこの構成でも実NFT・ZIP収録名を検査し、削除済み経路の版はnullを表示します。残るglob 13 / minimatch 10の対象GHSAは未解消で、major overrideは導入していません。

- 起点: `83478482da056fcea4e186187c9c5796b079f09b`（main）。元作業領域と分離したclone。
- lock: `nuxt/package-lock.json`、SHA-256 `1a8f129df2eb13b2a57451e7d9a538f16579906a23472aadf4f7b3bcade3687b`。基準commitとbyte一致。
- 検証環境: macOS arm64 / Node24.22.1。空HOME、空npm設定、合成入力。秘密、実CMS/DB、Botは不使用。

## 依存と更新可否

| 経路 | 現在 | 親の制約 | 公式修正 |
| --- | --- | --- | --- |
| Nitro → @vercel/nft 1.11.0 → glob | 13.0.6 | glob ^13.0.0 | glob14.0.2 |
| archiver7 → archiver-utils5.0.2 → glob | 10.5.0 | glob ^10.0.0 | glob14.0.2 |
| glob13 → minimatch | 10.2.6 | ^10.2.2 | minimatch11.0.1 |
| glob10 → minimatch | 9.0.9 | ^9.0.4 | minimatch11.0.1 |
| archiver7 → readdir-glob1.1.3 → minimatch | 5.1.9 | ^5.1.0 | DBでは11.0.1 |

npm公式metadataを確認。glob13/10、minimatch10/9/5の最新は13.0.6/10.5.0/10.2.6/9.0.9/5.1.9で、同majorの公表修正は確認できなかった。最新@vercel/nft1.11.0もglob^13、archiver-utils5.0.2もglob^10を要求。最新Nitro2.13.5はnft^1.11とarchiver^7.0.1。archiver8.0.0はNitroの範囲外で、更新してもreaddir-glob3→minimatch^10.2.2が残る。最新Content3.16.2もminimatch^10.2.6を要求する。

glob14.0.2/minimatch11.0.1のNode enginesはいずれも `18 || 20 || >=22`。本repoのNode24には適合するが、Node対応だけでメジャー互換とは判断しない。minimatch5のCJS exportは呼び出し可能なfunction、11はobject（named minimatch/Minimatch）でAPI差がある。readdir-globの現実装はnamed classを使うものの、グローバル置換が全利用者に安全とは言えない。

**判断:** 親の許容範囲内で両GHSAを解消する最小更新は確認できない。候補APIの小さな比較は成功したが、修正版を注入した全依存tree・全OS/Nodeでの統合検証は未実施。major override、lock値の手置換、未維持のfork/patch-package導入は採用しない。上流の親更新/公式バックポートを待つか、別途スコープを定めた移行と全体回帰検証を行う。

## 成立条件と実際の呼び出し

- [glob GHSA-3g3m-2fjr-6pw4](https://github.com/advisories/GHSA-3g3m-2fjr-6pw4): GitHubの直接範囲は >=9 <=14.0.1。npm auditの集約glob rangeには親への伝播も混ざるので区別する。途中abort後の探索継続が論点。インストール済みglob13と10のwalkerにreturn欠落、14.0.2にreturnを確認した。NFT `out/analyze.js` の2か所のglob呼出しはソースコード由来のwildcardとmark/ignore/dot/nodirを渡し、signalを渡さない。今回調べた経路でAbortSignalを時間制限に使う条件は確認できなかった。アプリ全体の到達不能証明ではない。
- [minimatch GHSA-g3hv-75wg-m249](https://github.com/advisories/GHSA-g3hv-75wg-m249): DB範囲は <11.0.1。10系と9系にはfirstPhasePreProcessのglobParts増幅処理が存在し、glob13とglob10はoptimizationLevel2を内部指定する。従ってアプリ側にこの指定がなくても条件を除外できない。入力パターンは今回確認したビルド経路ではプロジェクトのコード/設定由来。任意外部入力の到達は未立証。
- 5.1.9は同名のfirstPhasePreProcess/optimizationLevel処理を持たない。DBで該当する事実と、この特定アルゴリズムの成立条件を分ける。5系全体が安全と断定したり、DB対象から除外したりはしない。
- archiverの実際のdirectory/globはreaddir-glob→minimatch5のMinimatchを使用。archiver-utils.file.expandは別にglob.sync→glob10を使用できるため個別に検証した。ZIP成功だけでglob10の実経路まで実行されたとは扱わない。NitroのAzure presetのarchive patternは固定 `**/*`。本番presetや実稼働treeは未監査。

## 再現できる検証

package root（`nuxt/`）で実行:

```sh
npm ci --ignore-scripts --no-audit --no-fund
node scripts/check-glob-minimatch-compatibility.mjs
```

別の一時npm projectに公式 `glob@14.0.2 minimatch@11.0.1` を `npm install --save-exact --ignore-scripts` で導入し、そのprojectの絶対パスを同scriptの第1引数へ渡すと候補APIを比較できる。本repoの依存解決は変えない。実行時versionもJSON出力する。

合成8ファイルに対し、glob13/10/候補14のsync/asyncの収集集合（dot、ignore、brace、Unicode）、pre-aborted signal、minimatch各版の8入力×optimizationLevel0/1/2、archiver-utilsの除外/ファイルfilter、readdir-globの一覧、実NFTの3ファイル追跡、実ZIPのcentral-directory収録名を確認。候補との比較は成功。候補のglob/minimatchだけを直接比較しており、実NFT/archiver/Contentへの候補注入はしていない。大量入力・攻撃再現・性能計測は実施しない。pre-abort成功は途中abort脆弱性の解消証明ではない。

- npm ci --ignore-scripts、既存Vitest 2ファイル/4件、Nuxt build成功。
- `node scripts/check-static-generate-fixture.mjs` 成功。fetchは専用loopback以外を拒否、12 prerender routes、5 HTML画面と記事一覧/本文を検査。実WordPressは不使用。
- 既存packageにlint/typecheck scriptはない。Nuxtの型生成を独立した型検査成功とは扱わない。

既存依存treeのbuild/generate成功を、修正版treeの互換性証明と取り違えない。

## 残件・保全・次の判断

今回のnpm auditは15 package entries（直接GHSA数ではない）。glob/minimatchは残存。node-forge/deepmerge等は別件。既存draft PR #13を変更せず保持。

本番・ステージ・実サービスは変更していない。元checkout、旧lock、生成物に触れず、専用cloneで生成。元lockは上記基準commitから復元できる。このPRは文書/検証追加だけなので、将来の取り消しは追加ファイルのrevertで足り、DB復旧は不要。復旧作業自体は未実施。

次回は親の制約が修正majorを許容する更新を再確認し、全配置の解消、Node22/24（Oginoは26含む）、Linuxと実際のビルド/収集/アーカイブ/Content機能を修正版treeで検証してから修正PRを提案する。安全な範囲のpattern所有者管理は続けるが、今回設定変更は行わない。

## 一次資料

- [glob14.0.2 release](https://github.com/isaacs/node-glob/releases/tag/v14.0.2)、[minimatch11.0.1 release](https://github.com/isaacs/minimatch/releases/tag/v11.0.1)
- npm publisher metadata: [glob14.0.2](https://registry.npmjs.org/glob/14.0.2)、[minimatch11.0.1](https://registry.npmjs.org/minimatch/11.0.1)、[@vercel/nft1.11.0](https://registry.npmjs.org/@vercel%2fnft/1.11.0)、[archiver-utils5.0.2](https://registry.npmjs.org/archiver-utils/5.0.2)、[readdir-glob3.0.0](https://registry.npmjs.org/readdir-glob/3.0.0)、[archiver8](https://registry.npmjs.org/archiver/8.0.0)、[Nitro2.13.5](https://registry.npmjs.org/nitropack/2.13.5)、[Content3.16.2](https://registry.npmjs.org/@nuxt%2fcontent/3.16.2)
- 呼び出し/実装は上記lockから導入したpublisher配布物の `@vercel/nft/out/analyze.js`、`glob/dist/esm/{glob,walker}.js`、`archiver-utils/file.js`、`archiver/lib/core.js`、`readdir-glob/index.js`、各minimatch配布JSを照合。
