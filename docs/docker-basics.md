# Docker Desktopの準備と基本操作

## Dockerは何をしているのか

このスターターでは、Dockerが次の3つの実行環境をまとめて用意します。

| コンテナ | 役割 | ブラウザから見る場所 |
|---|---|---|
| `nuxt-wp-nuxt` | Nuxtの画面を表示する | http://localhost:3000 |
| `nuxt-wp-wordpress` | 投稿を管理し、APIを提供する | http://localhost:8080 |
| `nuxt-wp-db` | WordPressのデータを保存する | ブラウザからは直接開かない |

PCへWordPress、MySQL、Node.jsを個別にインストールしなくても、プロジェクトごとに必要な環境を起動できます。このスターターをDockerだけで動かす場合、ホストPCへのNode.jsとnpmのインストールは必須ではありません。

## Docker Desktopをインストールする

OSごとの要件や画面は更新されるため、インストール部分はDocker公式手順を参照してください。

- [macOS版の公式インストール手順](https://docs.docker.com/desktop/setup/install/mac-install/)
- [Windows版の公式インストール手順](https://docs.docker.com/desktop/setup/install/windows-install/)
- [Linux版の公式インストール手順](https://docs.docker.com/desktop/setup/install/linux/)

Windowsでは通常、Docker Desktopが案内するWSL 2方式を使用します。インストール後はDocker Desktopを起動し、エンジンの起動が完了するまで待ってください。

## 起動確認

ターミナルで次を実行します。

```bash
docker --version
docker compose version
docker info
```

バージョン情報とDockerの情報が表示されれば利用できます。`Cannot connect to the Docker daemon` と表示された場合は、Docker Desktopが起動しているか確認してください。

## このプロジェクトで使うコマンド

コマンドは `docker-compose.yml` があるフォルダで実行します。

```bash
# バックグラウンドで起動
docker compose up -d

# 状態を確認
docker compose ps

# ログを確認（Ctrl + Cで表示終了）
docker compose logs -f

# コンテナを再起動
docker compose restart

# 停止してコンテナを片付ける（データベースは残る）
docker compose down
```

## データが保存される場所

- WordPress本体・テーマ・プラグイン・アップロード：プロジェクト内の `wp/`
- WordPressの投稿や設定：Dockerの名前付きボリューム `db-data`
- Nuxtの依存パッケージ：Dockerの名前付きボリューム `nuxt-node-modules`

Docker Desktopでコンテナを削除しても、通常は名前付きボリュームが残っていれば投稿データを再利用できます。一方、`docker compose down -v` やDocker Desktopからのボリューム削除はデータ消失につながります。

## Docker Desktopのサインインは必要？

この公開リポジトリをローカルで試すだけなら、通常はDockerアカウントへのサインインは不要です。イメージ取得回数の制限や組織機能を利用する場合にはアカウントが必要になることがあります。

[はじめてのセットアップへ進む](getting-started.md) / [マニュアル一覧へ戻る](README.md)
