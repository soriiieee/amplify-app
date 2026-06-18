# 嫌すぎて滅

ストレス発散用の上司ボコボコアプリ。嫌な上司を登録して、AIが生成した攻撃パターンで仮想的にやっつけるWebアプリです。

---

## アプリ概要

```
① 上司登録       → 名前・メモ or 写真でAIがペルソナ推定
② ペルソナ精緻化 → AIとの2ラリー対話で上司の性格を深掘り
③ バトル         → クリック数を選択 → AIが攻撃パターンを3案提案
④ 滅エンディング → 派手なCSSアニメーションで上司が消える
```

### 主な機能

- 上司の名前・性格メモ、または写真（Claude Vision）でペルソナ自動生成
- AIとの対話（2ラリー）でペルソナを精緻化
- バトル時にAIが笑えるオリジナル攻撃パターンを3案提案
- HPゲージ・ダメージアニメーション・「滅」の派手な演出
- ペルソナ・バトルログをSQLiteに保存
- スマホ対応（モバイルファーストのレスポンシブデザイン）

---

## 技術スタック

| レイヤー | 技術 |
|---|---|
| フロントエンド | React 19 (Create React App) |
| バックエンド | Python 3.12 + FastAPI |
| AI | Claude API (claude-haiku-4-5、Vision対応) |
| DB | SQLite（Python組み込み） |
| パッケージ管理（Python） | uv |

---

## セットアップ

### 前提条件

- Node.js 18以上
- Python 3.12以上
- [uv](https://github.com/astral-sh/uv)
- Anthropic API キー

### 初回セットアップ

```bash
# 依存関係を一括インストール（Python仮想環境 + npm）
make install

# バックエンドの環境変数を設定
cp backend/.env.example backend/.env
# backend/.env を開き ANTHROPIC_API_KEY を設定
```

---

## 起動

```bash
# フロントエンド＋バックエンドを同時起動
make dev

# 個別起動
make backend    # http://localhost:8000
make frontend   # http://localhost:3000
```

ブラウザで http://localhost:3000 を開く。

---

## 使い方

### 1. 上司を登録する

- 上司の名前を入力
- テキストメモ（どんな人か）を入力、または写真をアップロード
- 「次へ」でAIがペルソナを自動生成

### 2. ペルソナを精緻化する

- AIが生成した性格分析（特徴・口癖・弱点・嫌さレベル）を確認
- AIからの質問に答えてペルソナを深掘り（2ラリー）
- 「このままバトルへ」で途中スキップも可能

### 3. バトルする

- 攻撃回数（5 / 10 / 30発）を選択
- 「攻撃パターンをAIに聞く」でAIが3案を提案
- 好みのパターンを選んで「ぶん殴る！」をタップ
- HPが0になると滅エンディングへ

### 4. 滅エンディング

- 派手なCSSアニメーションで上司が消滅
- 「もう一度やる」で最初に戻る

---

## ログ確認

バトルの記録はSQLiteに自動保存されます。

```bash
sqlite3 backend/data/app.db "SELECT * FROM persona_logs;"
sqlite3 backend/data/app.db "SELECT * FROM battle_logs;"
```

> `backend/data/` はGitHubには上がりません（.gitignoreで除外）。

---

## ディレクトリ構成

```
amplify-app/
├── Makefile
├── backend/
│   ├── main.py               # FastAPIアプリ本体
│   ├── database.py           # SQLiteログ管理
│   ├── pyproject.toml        # Python依存関係（uv）
│   ├── .env.example          # 環境変数テンプレート
│   ├── routers/
│   │   ├── persona.py        # /api/persona/analyze, /refine
│   │   └── battle.py         # /api/battle/suggest
│   └── services/
│       └── claude_client.py  # Claude API呼び出し
└── src/
    ├── App.js                # ルーティング
    └── pages/
        ├── SetupPage.js      # 上司登録
        ├── PersonaRefinePage.js  # ペルソナ精緻化
        ├── BattlePage.js     # バトル
        └── MetsuPage.js      # 滅エンディング
```

---

## 環境変数

`backend/.env` に以下を設定する。

| 変数名 | 説明 | デフォルト |
|---|---|---|
| `ANTHROPIC_API_KEY` | Anthropic APIキー | （必須） |
| `DB_PATH` | SQLiteファイルパス | `data/app.db` |
