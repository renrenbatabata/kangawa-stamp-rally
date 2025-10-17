# 🎉 かながわく区民まつり デジタルスタンプラリー

<div align="center">
  <img src="https://img.shields.io/badge/React-19.1.0-61DAFB?style=for-the-badge&logo=react&logoColor=white" />
  <img src="https://img.shields.io/badge/TypeScript-5.8.3-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Vite-7.0.3-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/Spring_Boot-Backend-6DB33F?style=for-the-badge&logo=springboot&logoColor=white" />
</div>

## 📖 概要

神奈川区区民まつりのために開発されたデジタルスタンプラリーのWebアプリケーションです。参加者はスマートフォンで各スタンプポイントに設置されたQRコードを読み込むことで、手軽にスタンプを集めることができます。

**アプリのインストール不要**で、ブラウザから簡単に参加できます！

このアプリはReact (TypeScript)で構築されたフロントエンドと、**Java (Spring Boot)** で構築されたバックエンド、そしてRDB（リレーショナルデータベース）を利用し、厳密な参加者管理を実現しています。

### 🎯 プロジェクトの特徴
- **ユーザーフレンドリーなエラーメッセージ**: ネットワークエラー時に「電波の良いところで再度お試しください」など、親しみやすい表現でユーザーをサポート
- **徹底したモバイル最適化**: スマートフォンでの利用を第一に考えた設計
- **オフライン対応**: ローカルストレージを活用した状態管理

## ✨ 主な機能

### 🎯 コア機能
- **ブラウザで簡単参加**: アプリインストール不要。スマートフォンのWebブラウザで直接アクセス
- **QRコードスキャン**: 内蔵カメラでQRコードを読み取り、スタンプをゲット
- **クイズチャレンジ**: 各ポイントでクイズに答えてスタンプを獲得
- **リアルタイム進捗表示**: スタンプの獲得状況がリアルタイムで更新
- **会場マップ**: ピンチズーム対応のインタラクティブな会場マップ
- **初回ウォークスルー**: 初めての利用者向けのわかりやすいチュートリアル

### 🔒 セキュリティ・管理
- **厳密な参加者管理**: UUIDによるユニークユーザー識別
- **不正防止**: バックエンドでのスタンプ取得状況の一元管理
- **データベース連携**: RDBによる確実なデータ永続化

### 🎨 UI/UX
- **レスポンシブデザイン**: スマートフォン、タブレット、PCに最適化
- **直感的なインターフェース**: 親しみやすいデザインで迷わず操作可能
- **アクセシビリティ対応**: ARIA属性の適切な設定
- **親しみやすいエラー表示**: 技術用語を避け、誰にでも分かりやすい言葉でエラーを説明

## 🛠 技術スタック

### フロントエンド
| 技術 | バージョン | 用途 |
|------|-----------|------|
| React | 19.1.0 | UIフレームワーク |
| TypeScript | 5.8.3 | 型安全な開発 |
| Vite | 7.0.3 | ビルドツール |
| React Router | 7.6.3 | ページルーティング |
| @zxing/browser | 0.1.5 | QRコードスキャン |
| CSS Modules | - | コンポーネント単位のスタイル管理 |
| Vercel Speed Insights | 1.2.0 | パフォーマンス計測 |

### バックエンド
- **Java** - バックエンドの主要言語
- **Spring Boot** - Webアプリケーションフレームワーク
- **RDB** - リレーショナルデータベース

### 開発ツール
- **ESLint** - コード品質管理
- **Storybook** - コンポーネント開発・ドキュメント
- **Vitest** - テストフレームワーク

## 📁 プロジェクト構造

```
kangawa-stamp-rally/
├── src/
│   ├── assets/              # 画像・アイコンなどの静的ファイル
│   │   ├── icon/           # アイコン画像
│   │   ├── images/         # 一般画像
│   │   └── stamp_points/   # スタンプポイント画像
│   ├── components/         # Reactコンポーネント
│   │   ├── common/         # 共通コンポーネント
│   │   │   ├── CameraButton/
│   │   │   ├── FooterNav/
│   │   │   ├── Header/
│   │   │   ├── ScanButton/
│   │   │   └── StampBadge/
│   │   ├── StampCard/
│   │   ├── StampList/
│   │   └── Walkthrough/    # 初回チュートリアル
│   ├── hooks/              # カスタムフック
│   │   ├── useContext.tsx
│   │   ├── useQRCodeScanner.ts
│   │   └── useUserRegistration.ts
│   ├── pages/              # ページコンポーネント
│   │   ├── HomePage/
│   │   ├── StampListPage/
│   │   ├── MapPage/
│   │   ├── CameraPage/
│   │   ├── Quizpage/
│   │   ├── ScanResultSuccessPage/
│   │   └── ScanResultFailPage/
│   ├── styles/             # グローバルスタイル
│   ├── types/              # TypeScript型定義
│   ├── App.tsx             # ルートコンポーネント
│   └── main.tsx            # エントリーポイント
├── public/                 # 公開ファイル
│   └── data/              # モックデータ
├── dist/                   # ビルド出力
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## 🚀 セットアップ

### 前提条件
- Node.js (v18以上推奨)
- npm または yarn
- モダンブラウザ（Chrome, Safari, Edge等）

### インストール

```bash
# リポジトリのクローン
git clone https://github.com/your-repo/kangawa-stamp-rally.git
cd kangawa-stamp-rally

# 依存関係のインストール
npm install
```

### 環境変数の設定

`.env`ファイルをプロジェクトルートに作成し、以下の環境変数を設定します：

```env
# QRコード接頭辞（スタンプのQRコードに使用）
VITE_QR_PREFIX=your_qr_prefix

# ページパス
VITE_SUCCESS_PATH=/scan/success
VITE_FAIL_PATH=/scan/fail

# モックデータの使用（開発時: true / 本番: false）
VITE_USE_MOCK_DATA=true

# APIベースURL（本番環境で必須、開発時はモックデータを使用する場合は不要）
VITE_API_BASE_URL=https://your-api-endpoint.com
```

> **開発時のTips**: `VITE_USE_MOCK_DATA=true` に設定すると、バックエンドなしでフロントエンドの開発が可能です。`public/data/`にあるモックJSONファイルが使用されます。

### 開発サーバーの起動

```bash
# 開発サーバー起動
npm run dev

# ブラウザで http://localhost:5173 にアクセス
```

### ビルド

```bash
# プロダクションビルド
npm run build

# プレビュー
npm run preview
```

#### ビルド時の最適化
ビルド時には以下の最適化が自動的に実行されます：
- 📦 **画像圧縮**: PNGファイルが最大78%圧縮
- 🗜️ **コード圧縮**: Gzip (.gz) と Brotli (.br) の両方を生成
- ✂️ **コード分割**: ライブラリごとに最適なチャンクに分割
- 🎯 **Tree-shaking**: 未使用コードの自動削除

ビルド完了後、`dist/assets/`フォルダに圧縮ファイルが生成されます。

### その他のコマンド

```bash
# リント実行
npm run lint

# Storybook起動
npm run storybook

# Storybookビルド
npm run build-storybook
```

## 📱 使い方

### 1. 初回アクセス
アプリに初めてアクセスすると、ウォークスルーが表示されます。
- アプリの使い方を4ステップで説明
- スキップも可能
- 初回のみ表示（LocalStorageで管理）

### 2. スタンプを集める
1. ホーム画面の「スキャン」ボタンをタップ
2. カメラが起動するので、QRコードを読み取る
3. クイズが表示されるので、正解を選択
4. 正解・不正解に関わらずスタンプをゲット！

### 3. 進捗確認
- スタンプリストページで獲得済みスタンプを確認
- 獲得したスタンプの詳細情報を表示
- 獲得日時も記録

### 4. 会場マップ
- 会場全体のマップを表示
- ピンチイン・ピンチアウトで拡大・縮小
- プログラム情報も確認可能

## 🔐 セキュリティとデータ管理

### ユーザー識別
- 初回アクセス時にUUID（v4）を自動生成
- LocalStorageに永続化してデバイスを識別
- バックエンドに送信して登録・認証

### データ管理
- スタンプ取得情報はバックエンドで一元管理
- 重複取得の防止機能
- RDBによる確実なデータ永続化

### エラーハンドリング
- ネットワークエラー時の分かりやすいメッセージ表示
- カメラ権限エラーの詳細なガイダンス
- リトライしやすいユーザー体験

## 🎨 コードスタイル

### import順序
```typescript
// React
import { useState, useEffect } from "react";

// サードパーティ
import { useNavigate } from "react-router-dom";

// 内部モジュール
import { useUserContext } from "../../hooks/useContext";

// アセット
import logo from "../../assets/images/logo.png";

// CSS
import styles from "./Component.module.css";
```

### コンポーネント設計
- 関数コンポーネント + Hooks
- TypeScriptによる型安全性
- CSS Modulesでスコープ化されたスタイル
- レスポンシブデザイン対応

## 📊 コード品質と最適化

### 実装済み機能・改善
- ✅ TypeScriptによる型安全な実装
- ✅ React 19の最新機能活用
- ✅ レイジーローディングによるパフォーマンス最適化
- ✅ 環境変数による柔軟な設定管理
- ✅ カスタムフックによるロジックの再利用
- ✅ CSS Modulesによるスタイルのスコープ化
- ✅ アクセシビリティ対応（ARIA属性、セマンティックHTML）
- ✅ レスポンシブデザイン（モバイルファースト）
- ✅ ユーザーフレンドリーなエラーメッセージ
- ✅ ローディング状態の適切な管理
- ✅ 開発環境専用ロガーの実装

### ⚡ パフォーマンス最適化
- ✅ **画像最適化**: PNGファイルを70-78%圧縮（vite-plugin-imagemin）
  - background.png: 2.9MB → 650KB (-78%)
  - map.png: 1.6MB → 1.2MB (-23%)
  - stamp_icon_unachieved.png: 1.2MB → 285KB (-78%)
- ✅ **コード圧縮**: GzipとBrotli圧縮の両方を適用
  - Gzip圧縮: 最大74%削減
  - Brotli圧縮: 最大80%削減（より効率的）
- ✅ **チャンク分割の最適化**:
  - React関連ライブラリを1つのチャンクに統合
  - QRコードライブラリを独立したチャンクに分離
  - 初回ロード時間の短縮
- ✅ **遅延読み込み**: 全画像にloading="lazy"または適切な優先度設定
  - ファーストビュー画像: fetchPriority="high"
  - その他の画像: loading="lazy"
- ✅ **フォント最適化**:
  - font-display: swap（フォント読み込み中もテキスト表示）
  - preconnect/dns-prefetchによる事前接続
- ✅ **ビルド最適化**:
  - Tree-shaking有効化
  - CSSコード分割
  - ソースマップの本番無効化

### 開発体制
- **開発言語**: TypeScript（型安全性の確保）
- **コードスタイル**: 統一されたimport順序とフォーマット
- **品質管理**: ESLintによる静的解析
- **コンポーネント管理**: Storybookによるコンポーネントカタログ

## 📚 関連ドキュメント

- **KAMETARO_SETUP.md**: かめ太郎画像のセットアップ手順
  - ウォークスルーに使用するかめ太郎画像の配置方法
  - 絵文字表示から画像表示への切り替え方法

## 🤝 コントリビューション

プロジェクトへの貢献を歓迎します！

1. このリポジトリをフォーク
2. 機能ブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add some amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成

## 📝 ライセンス

このプロジェクトは神奈川区区民まつりのために開発されました。

## 👥 開発チーム

神奈川区区民まつり デジタルスタンプラリー開発チーム

## 📞 サポート

### よくある質問

**Q: カメラが起動しない**
A: ブラウザの設定でカメラへのアクセスを許可してください。詳しくはマップページの「その他」→「カメラ設定」をご確認ください。

**Q: スタンプが登録されない**
A: 電波の良いところで再度お試しください。それでも解決しない場合は、ページを再読み込みしてください。

**Q: 初回のウォークスルーをもう一度見たい**
A: ブラウザのローカルストレージをクリアするか、マップページから再表示できます。

---

<div align="center">
Made with ❤️ for 神奈川区区民まつり
</div>
