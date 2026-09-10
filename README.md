# Yuto Iwamoto Portfolio（岩本佑都 ポートフォリオサイト）

モダンな宇宙的デザイン、アニメーション遷移、経歴タイムライン、制作実績ギャラリーを搭載したポートフォリオサイトです。

---

## 🚀 GitHub / GitHub Pages への公開手順

本リポジトリは、**GitHub Pages（無料ホスティング）** にそのまま公開できるように構成されています。  
`base: './'` の相対パス設定と、自動デプロイ用の **GitHub Actions ワークフロー (`.github/workflows/deploy.yml`)** がすでに組み込まれています。

### 方法1: AI Studio から直接 GitHub へエクスポートする場合
1. 画面右上のメニュー（または設定アイコン）から **「Export to GitHub」** を選択します。
2. 連携先の GitHub アカウントとリポジトリ名を選択してエクスポートを実行します。
3. エクスポート完了後、下記の **「GitHub Pages の有効化」** を行います。

---

### 方法2: ZIPダウンロードまたは Git コマンドでプッシュする場合
```bash
# ローカルでリポジトリを初期化してプッシュ
git init
git add .
git commit -m "feat: initial portfolio release"
git branch -M main
git remote add origin https://github.com/<あなたのユーザー名>/<リポジトリ名>.git
git push -u origin main
```

---

### ⚙️ GitHub Pages の有効化（公開設定）

1. GitHub の対象リポジトリ画面を開きます。
2. 上部メニューの **「Settings（設定）」** をクリックします。
3. 左サイドバーの **「Pages」** をクリックします。
4. **「Build and deployment」** の **「Source」** ドロップダウンで：
   - 👉 **「GitHub Actions」** を選択します。
5. 以上で完了です！数分以内に `.github/workflows/deploy.yml` が自動実行され、公開URL（`https://<ユーザー名>.github.io/<リポジトリ名>/`）が発行されます。

---

## 💻 ローカル開発環境の起動

```bash
# 依存関係のインストール
npm install

# 開発サーバーの起動 (http://localhost:3000)
npm run dev

# プロダクションビルド（dist/ に生成）
npm run build

# ビルド成果物のプレビュー
npm run preview
```

---

## 🛠 主な機能と技術スタック
- **Vite + React 19 + TypeScript**
- **Tailwind CSS v4**
- **Motion (Framer Motion)** によるスムーズなカードスライド＆フェード遷移
- **itta.dev風カードビュー & 全体スクロール表示** のデュアルレイアウト切り替え
- **ブラウザ内CMS機能**: 作品データや経歴、プロフィール写真の変更・アップロードをブラウザ上で直接編集可能
