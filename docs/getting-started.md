# はじめてのセットアップ

このページでは、ファイルの取得からWordPressの記事がNuxtに表示されるところまでを順番に進めます。

## 1. Docker Desktopを準備する

[Docker Desktopの準備と基本操作](docker-basics.md)を参考にインストールし、Docker Desktopを起動してください。

ターミナルで次の2つが表示できれば準備完了です。

```bash
docker --version
docker compose version
```

## 2. プロジェクトを取得する

GitHubアカウントを持っていない場合は、リポジトリの **Code → Download ZIP** から取得できます。

- [GitHubでリポジトリを開く](https://github.com/hane-jp/nuxt-wordpress-docker)
- [ZIPを直接ダウンロードする](https://github.com/hane-jp/nuxt-wordpress-docker/archive/refs/heads/main.zip)

ダウンロードしたZIPを展開し、作成された `nuxt-wordpress-docker-main` フォルダを開きます。詳しくは[GitHubアカウントなしで始める](github-without-account.md)を参照してください。

Gitを使える場合は、次の方法でも取得できます。

```bash
git clone https://github.com/hane-jp/nuxt-wordpress-docker.git
cd nuxt-wordpress-docker
```

## 3. ターミナルでプロジェクトを開く

- macOS：Finderでフォルダを右クリックし、「フォルダに新規ターミナル」を選ぶ
- Windows：エクスプローラーでフォルダを右クリックし、「ターミナルで開く」を選ぶ

メニューが見つからない場合は、ターミナルで `cd ` と入力し、フォルダをターミナルへドラッグしてEnterを押します。

## 4. 設定ファイルを作る

macOSまたはLinux：

```bash
cp .env.example .env
```

Windows PowerShell：

```powershell
Copy-Item .env.example .env
```

ここで作る `.env` はDockerがデータベース名や接続先を読むための設定ファイルです。最初のローカル確認では内容を変更しなくても動作します。

## 5. コンテナを起動する

```bash
docker compose up -d
```

初回はWordPress、MySQL、Node.jsのイメージとパッケージを取得するため、数分かかることがあります。処理状況は次のコマンドで確認できます。

```bash
docker compose ps
docker compose logs -f
```

ログ表示は `Ctrl + C` で終了できます。コンテナ自体は停止しません。

## 6. WordPressを初期設定する

ブラウザで [http://localhost:8080](http://localhost:8080) を開き、画面に従って次を設定します。

- 言語
- サイトのタイトル
- 管理者ユーザー名
- 管理者パスワード
- メールアドレス

管理者のユーザー名とパスワードは、`.env` のデータベース用ユーザー名・パスワードとは別物です。

## 7. Nuxt側を確認する

[http://localhost:3000](http://localhost:3000) を開きます。「API CONNECTION 接続済み」と投稿件数が表示されれば連携完了です。

| URL | 内容 |
|---|---|
| http://localhost:3000 | Nuxtのトップページ |
| http://localhost:3000/posts | WordPressから取得した投稿一覧 |
| http://localhost:3000/guide | このスターターの使い方ガイド |
| http://localhost:8080/wp-admin | WordPress管理画面 |

WordPress管理画面で投稿を追加・公開したあと、Nuxtの投稿一覧を再読み込みすると内容が反映されます。

## 8. 作業を終える

```bash
docker compose down
```

この停止方法ではWordPressのデータベースは残ります。次回は同じフォルダで `docker compose up -d` を実行してください。

> `docker compose down -v` はデータベースも削除します。最初から作り直したい場合以外は実行しないでください。

うまく表示されない場合は[トラブルシューティング](troubleshooting.md)を確認してください。

[マニュアル一覧へ戻る](README.md)
