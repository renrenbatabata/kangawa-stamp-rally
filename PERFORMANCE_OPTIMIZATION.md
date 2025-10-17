# ⚡ パフォーマンス最適化ガイド

このドキュメントでは、かながわく区民まつり デジタルスタンプラリーに実装されたパフォーマンス最適化について説明します。

## 📊 最適化の成果

### 画像サイズの削減
ビルド時に自動的に画像が最適化され、大幅なファイルサイズ削減を実現：

| ファイル名 | 元のサイズ | 最適化後 | 削減率 |
|-----------|----------|---------|--------|
| background.png | 2.9MB | 650KB | **-78%** |
| map.png | 1.6MB | 1.2MB | **-23%** |
| stamp_icon_unachieved.png | 1.2MB | 285KB | **-78%** |
| logo.png | 176KB | 49KB | **-72%** |
| Header.png | 368KB | 82KB | **-78%** |

**合計削減**: 約6MBのデータ転送量を削減

### JavaScriptファイルの最適化
チャンク分割により、必要なコードのみを効率的に読み込み：

| チャンク | サイズ | Gzip | Brotli |
|---------|-------|------|--------|
| qr-vendor | 412KB | 108KB | **79KB** |
| react-vendor | 46KB | 16KB | **14KB** |
| index (main) | 186KB | 60KB | **51KB** |

## 🔧 実装された最適化技術

### 1. 画像最適化

#### vite-plugin-imagemin
ビルド時に全ての画像を自動圧縮：
```typescript
// vite.config.ts
viteImagemin({
  optipng: { optimizationLevel: 7 },
  pngquant: { quality: [0.8, 0.9], speed: 4 },
  mozjpeg: { quality: 80 },
})
```

#### 遅延読み込み (Lazy Loading)
ビューポート外の画像は必要になるまで読み込まない：
```tsx
// ファーストビュー以外の画像
<img src={image} alt="..." loading="lazy" />

// ファーストビューの重要な画像
<img src={logo} alt="..." fetchPriority="high" />
```

#### 画像レンダリング最適化
CSSでレンダリング品質を最適化：
```css
img {
  image-rendering: -webkit-optimize-contrast;
  image-rendering: crisp-edges;
}
```

### 2. コード圧縮

#### Gzip & Brotli圧縮
両方の圧縮形式を生成し、ブラウザが最適なものを選択：
```typescript
// vite.config.ts
viteCompression({
  algorithm: 'gzip',
  threshold: 10240, // 10KB以上を圧縮
})

viteCompression({
  algorithm: 'brotliCompress',
  threshold: 10240,
})
```

**効果**: 
- Gzip: 最大74%削減
- Brotli: 最大80%削減（より効率的）

### 3. チャンク分割の最適化

ライブラリを論理的なグループに分割し、キャッシュ効率を向上：

```typescript
// vite.config.ts
manualChunks: {
  'react-vendor': ['react', 'react-dom', 'react-router-dom'],
  'qr-vendor': ['@zxing/browser', '@zxing/library', 'react-zxing'],
  'misc-vendor': ['uuid', '@vercel/speed-insights'],
}
```

**メリット**:
- 共通ライブラリの効率的なキャッシング
- 初回ロード時間の短縮
- 更新時の影響範囲を最小化

### 4. レイジーローディング (Code Splitting)

ページコンポーネントを動的インポートで分割：
```tsx
// App.tsx
const HomePage = lazy(() => import("./pages/HomePage/HomePage"));
const StampListPage = lazy(() => import("./pages/StampListPage/StampListPage"));
const MapPage = lazy(() => import("./pages/MapPage/MapPage"));
```

**効果**: 初回ロード時に必要なJavaScriptを最小限に抑制

### 5. フォント最適化

#### プリコネクト
DNS解決を事前に実行：
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
```

#### font-display: swap
フォント読み込み中もテキストを表示：
```css
body {
  font-display: swap;
  text-rendering: optimizeLegibility;
}
```

#### モジュールプリロード
重要なJavaScriptモジュールを事前読み込み：
```html
<link rel="modulepreload" href="/src/main.tsx">
```

### 6. ビルド設定の最適化

```typescript
// vite.config.ts
build: {
  sourcemap: false,          // 本番でソースマップ無効化
  cssCodeSplit: true,        // CSS分割有効化
  minify: 'esbuild',        // 高速な圧縮
  target: 'es2015',         // ターゲットブラウザ設定
  chunkSizeWarningLimit: 1000,
}
```

## 📈 パフォーマンス計測

### Vercel Speed Insights
リアルユーザーのパフォーマンスデータを収集：
```tsx
import { SpeedInsights } from "@vercel/speed-insights/react";

<SpeedInsights />
```

### Core Web Vitals目標値
- **LCP (Largest Contentful Paint)**: < 2.5秒
- **FID (First Input Delay)**: < 100ms
- **CLS (Cumulative Layout Shift)**: < 0.1

## 🚀 さらなる最適化のヒント

### 開発者向け

1. **画像を追加する場合**:
   - PNG形式で追加してOK（ビルド時に自動最適化）
   - 可能な限り小さいサイズでデザインを作成
   - `loading="lazy"`属性を忘れずに

2. **新しいページを追加する場合**:
   - `lazy()`でインポート
   - 必要に応じて新しいチャンクを`manualChunks`に追加

3. **外部ライブラリを追加する場合**:
   - バンドルサイズを確認（`npm run build`後のログ）
   - 1000KB以上の場合は代替案を検討

### サーバー設定（Vercel/本番環境）

本番環境では以下の設定が推奨されます：

```json
// vercel.json
{
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    },
    {
      "source": "/(.*).br",
      "headers": [
        {
          "key": "Content-Encoding",
          "value": "br"
        }
      ]
    },
    {
      "source": "/(.*).gz",
      "headers": [
        {
          "key": "Content-Encoding",
          "value": "gzip"
        }
      ]
    }
  ]
}
```

## 📚 参考リンク

- [Vite Performance Guide](https://vitejs.dev/guide/performance.html)
- [Web.dev Performance](https://web.dev/performance/)
- [Core Web Vitals](https://web.dev/vitals/)
- [Image Optimization Best Practices](https://web.dev/fast/#optimize-your-images)

---

最終更新: 2025年10月17日

