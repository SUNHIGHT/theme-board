# diary-sync(日記の同期サーバー)

日記アプリ(`game-theme-diary/`)の日記を、複数の端末で共有するための小さなAPIです。
Cloudflare の **Workers**(サーバー)と **D1**(データベース)で動き、無料枠で足ります。

- 日記は全テーマ共通で、1日1件、`{ 日付, 調子, 本文, 更新時刻 }` として保存されます。
- 同じ日を別の端末で編集した場合は、**あとから更新したほう**が残ります(日付ごと)。
- 認証は、あなたが決める**合言葉(トークン)**1つだけです。合言葉を知らない人は、日記を読めません。
- 端末側の仕組みは `game-theme-diary/theme-switch.js` に入っていて、**各テーマの画面を変える必要はありません**。

## 導入手順(Wrangler / コマンドを使う方法・おすすめ)

PC に Node.js が入っている前提です。

```bash
cd sync-worker
npm install -g wrangler          # まだなら
wrangler login                   # ブラウザが開くので Cloudflare にログイン

# 1. データベースを作る(表示される database_id をコピー)
wrangler d1 create diary-sync

# 2. wrangler.toml の database_id を、コピーした値に書き換える

# 3. テーブルを作る
wrangler d1 execute diary-sync --remote --file=./schema.sql

# 4. 合言葉を登録する(プロンプトに、長いランダムな文字列を貼り付ける)
wrangler secret put SYNC_TOKEN

# 5. 公開する(最後に https://diary-sync.<あなたの名前>.workers.dev が表示される)
wrangler deploy
```

合言葉は、日記アプリの「同期設定」画面にある「合言葉を生成」ボタンで作れます(同じ値を手順4に貼ります)。

## 導入手順(ダッシュボードだけで行う方法)

コマンドを使わず、ブラウザだけでも作れます。

1. Cloudflare ダッシュボード → **Storage & databases → D1** → **Create database**(名前: `diary-sync`)。
2. 作ったデータベースの **Console** を開き、`schema.sql` の中身を貼り付けて実行。
3. **Workers & Pages → Create → Create Worker** で、名前を `diary-sync` にして作成(最初のサンプルのまま Deploy)。
4. 作った Worker の **Edit code** を開き、`src/index.js` の中身をすべて貼り付けて Deploy。
5. Worker の **Settings → Bindings → Add → D1 database**:変数名 `DB`、データベースは `diary-sync`。
6. Worker の **Settings → Variables and Secrets → Add**:種類 **Secret**、名前 `SYNC_TOKEN`、値は合言葉。
7. 動作確認: Worker のURL(`https://diary-sync.<名前>.workers.dev/`)を開いて `{"ok":true,...}` と出ればOK。

## 日記アプリにつなぐ

1. 日記アプリの最初の画面の「☁ 同期設定」(`sync.html`)を開く。
2. Worker のURLと合言葉を入力して「保存して同期」。
3. 別の端末でも、同じURLと合言葉を入れる。

以降は、日記を書くたびに自動で送信され、開いたとき・1分ごと・画面にもどったときに、他の端末の変更を取り込みます。
同期できている間は、画面右上の THEME ボタンに ☁ が付きます(失敗時は ☁✕)。

## 補足

- `ALLOWED_ORIGINS`(`wrangler.toml` の `[vars]`)は、ブラウザからのアクセスを許可する元のURLです。`*` は全て許可で、合言葉があるので、そのままでも使えます。絞りたい場合は、`https://sunhight.github.io` のように書きます。
- 合言葉は、端末のブラウザ内(localStorage)に保存されます。共有のパソコンでは入れないでください。
- 日記の削除は同期されません(日記アプリに、削除の機能がないためです)。
- API: `GET /api/ping` / `GET /api/entries?since=<ms>` / `PUT /api/entries`(`Authorization: Bearer <合言葉>`)。
