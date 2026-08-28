# GitHubアカウントなしで始める

このリポジトリは公開されているため、GitHubアカウントがなくても閲覧とZIPダウンロードができます。Gitのインストールも不要です。

## ZIPで取得する

1. [リポジトリのページ](https://github.com/hane-jp/nuxt-wordpress-docker)を開く
2. 緑色の **Code** ボタンを押す
3. **Download ZIP** を押す
4. ダウンロードしたZIPを展開する
5. 展開されたフォルダで[はじめてのセットアップ](getting-started.md)を進める

[ZIPを直接ダウンロード](https://github.com/hane-jp/nuxt-wordpress-docker/archive/refs/heads/main.zip)することもできます。

## ZIP版でできること・できないこと

| 項目 | ZIP版 |
|---|---|
| ローカルで起動する | できる |
| コードを編集する | できる |
| WordPressへ投稿する | できる |
| 更新版を `git pull` で取得する | できない |
| GitHubへ変更履歴を保存する | アカウントとGitの準備が必要 |
| IssueやPull Requestを送る | GitHubアカウントが必要 |

ZIPには、その時点のファイルだけが含まれ、Gitの変更履歴は含まれません。これは[GitHub公式ドキュメント](https://docs.github.com/en/repositories/working-with-files/using-files/downloading-source-code-archives)にも説明されています。

## ZIP版を更新するときの注意

更新版は新しいZIPとして届くため、既存フォルダへそのまま上書きしないでください。自分で変更したファイルが失われる可能性があります。

また、Docker Composeは通常、親フォルダ名をプロジェクト名として扱います。展開のたびにフォルダ名が変わると、以前のデータベースとは別のボリュームが作られ、投稿が消えたように見える場合があります。

ZIP版はまず試す用途に向いています。継続的にコードを変更したり、更新を取り込んだりする段階になったら、GitHubアカウントとGitの利用をおすすめします。

## GitHubアカウントを作る場合

- [GitHubアカウントの作成方法（公式）](https://docs.github.com/en/account-and-profile/how-tos/account-management/creating-an-account-on-github)
- [GitHubを始める（公式）](https://docs.github.com/en/get-started/onboarding/getting-started-with-your-github-account)
- [コードをローカルで扱う方法（公式）](https://docs.github.com/en/get-started/start-your-journey/connecting-to-your-code-locally)

アカウント作成は、このスターターを一度表示してからでも遅くありません。

[マニュアル一覧へ戻る](README.md)
