# トラブルシューティング

まず、ターミナルで `docker-compose.yml` があるフォルダを開いていることと、Docker Desktopが起動済みであることを確認してください。

## 状態とログを確認する

```bash
docker compose ps
docker compose logs --tail=100
```

`nuxt-wp-db`、`nuxt-wp-wordpress`、`nuxt-wp-nuxt` の3つが起動し、最終的に `healthy` になれば正常です。初回はイメージやパッケージの取得に時間がかかります。

## `docker` コマンドが見つからない

Docker Desktopがインストールされていないか、インストール直後でターミナルへ反映されていない可能性があります。[Docker Desktopの準備](docker-basics.md)を確認し、Docker Desktopとターミナルを再起動してください。

## Docker daemonへ接続できない

`Cannot connect to the Docker daemon` が表示された場合は、Docker Desktopを起動し、エンジンの準備が完了してから再実行します。

## ポートが使用中と表示される

`port is already allocated` や `address already in use` は、別のアプリが同じポートを使っている状態です。

- 3000：Nuxt
- 8080：WordPress

該当するアプリや別のDockerプロジェクトを停止してから、再度 `docker compose up -d` を実行してください。

## WordPressの初期設定画面が開かない

データベースの起動を待っている場合があります。

```bash
docker compose ps
docker compose logs db wordpress
```

数分待っても改善しない場合は、設定ファイルが存在するか確認します。

```bash
ls -la .env
```

Windows PowerShellでは次を使えます。

```powershell
Get-Item .env
```

## Nuxtに「接続できません」と表示される

1. [http://localhost:8080](http://localhost:8080) でWordPressの初期設定を完了する
2. [http://localhost:8080/wp-json](http://localhost:8080/wp-json) が開くか確認する
3. Nuxtを再起動する

```bash
docker compose restart nuxt
```

## 投稿が表示されない

- WordPressの投稿が「公開」状態か確認する
- Nuxtのページを再読み込みする
- WordPress管理画面の「設定 → パーマリンク」で、変更せずに「変更を保存」を押す

## 以前の投稿が消えたように見える

ZIPを別名のフォルダへ展開すると、Dockerが別プロジェクトとして扱い、新しいデータベースボリュームを作る場合があります。以前使っていたフォルダへ戻り、そこで `docker compose up -d` を実行して確認してください。

データを消す可能性があるため、原因確認中は `docker compose down -v` やDocker Desktopのボリューム削除を実行しないでください。

## それでも解決しない場合

[GitHub Issues](https://github.com/hane-jp/nuxt-wordpress-docker/issues)で、次の情報を添えて報告してください。Issueの投稿にはGitHubアカウントが必要です。

- 使用OSとバージョン
- Docker Desktopのバージョン
- 実行したコマンド
- `docker compose ps` の結果
- `docker compose logs --tail=100` のうち、パスワードなどを除いたエラー部分

[マニュアル一覧へ戻る](README.md)
