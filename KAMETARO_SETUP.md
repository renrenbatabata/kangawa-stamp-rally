# 🐢 かめ太郎画像のセットアップ手順

## 📋 必要な画像

以下の4つのかめ太郎のポーズ画像を準備してください：

### 1. ようこそ画面
- **使用するポーズ**: `05 お出迎えポーズ`
- **ファイル名**: `welcome.png`
- **用途**: 初回ウォークスルーの最初の画面

### 2. スタンプを集めよう画面
- **使用するポーズ**: `23 カメラを首から下げているかめ太郎`
- **ファイル名**: `camera.png`
- **用途**: QRコードスキャンの説明画面

### 3. 地図を見よう画面
- **使用するポーズ**: `34 旅姿かめ太郎`
- **ファイル名**: `map.png`
- **用途**: 会場マップの説明画面

### 4. スタンプを確認画面
- **使用するポーズ**: `06 ガッツポーズ`
- **ファイル名**: `complete.png`
- **用途**: コンプリート画面

---

## 📁 フォルダ構成

以下のようなフォルダ構成で画像を配置してください：

```
kangawa-stamp-rally/
└── src/
    └── assets/
        └── images/
            └── kametaro/          ← このフォルダを新規作成
                ├── welcome.png    ← 05 お出迎えポーズ
                ├── camera.png     ← 23 カメラかめ太郎
                ├── map.png        ← 34 旅姿かめ太郎
                └── complete.png   ← 06 ガッツポーズ
```

---

## 🚀 セットアップ手順

### ステップ1: フォルダを作成

```bash
mkdir -p src/assets/images/kametaro
```

### ステップ2: 画像を配置

提供されたかめ太郎の画像から以下のポーズを切り出して、上記のファイル名で保存してください：

1. `05 お出迎えポーズ` → `src/assets/images/kametaro/welcome.png`
2. `23 カメラを首から下げているかめ太郎` → `src/assets/images/kametaro/camera.png`
3. `34 旅姿かめ太郎` → `src/assets/images/kametaro/map.png`
4. `06 ガッツポーズ` → `src/assets/images/kametaro/complete.png`

### ステップ3: コードのコメントを解除

`src/components/Walkthrough/Walkthrough.tsx` ファイルを開いて、以下のコメントアウトされた行を解除してください：

**import文（6〜9行目）:**
```typescript
// 現在（コメントアウト状態）:
// import kametaroWelcome from "../../assets/images/kametaro/welcome.png";
// import kametaroCamera from "../../assets/images/kametaro/camera.png";
// import kametaroMap from "../../assets/images/kametaro/map.png";
// import kametaroComplete from "../../assets/images/kametaro/complete.png";

// ↓ コメントを外す:
import kametaroWelcome from "../../assets/images/kametaro/welcome.png";
import kametaroCamera from "../../assets/images/kametaro/camera.png";
import kametaroMap from "../../assets/images/kametaro/map.png";
import kametaroComplete from "../../assets/images/kametaro/complete.png";
```

**steps配列内（36、44、52、60行目付近）:**
```typescript
// 現在（コメントアウト状態）:
// imageUrl: kametaroWelcome, // 画像配置後にコメント解除

// ↓ コメントを外す:
imageUrl: kametaroWelcome,
```

4箇所すべてでコメントを解除してください。

### ステップ4: 動作確認

```bash
npm run dev
```

ブラウザで確認して、ウォークスルーにかめ太郎が表示されることを確認してください！

---

## 🎨 画像の推奨仕様

- **ファイル形式**: PNG（透過背景推奨）
- **推奨サイズ**: 300px × 300px 程度
- **背景**: 透過PNG推奨（白背景でも可）
- **ファイルサイズ**: 各100KB以下推奨

---

## 🔄 絵文字に戻す方法

かめ太郎の画像ではなく、絵文字に戻したい場合は、コメントアウトした行を再度コメントにすれば、自動的に絵文字表示に切り替わります。

---

## ❓ トラブルシューティング

### 画像が表示されない場合

1. **ファイル名を確認**
   - ファイル名が正確に一致しているか確認してください
   - 大文字・小文字を区別します

2. **ファイルパスを確認**
   - `src/assets/images/kametaro/` に配置されているか確認

3. **開発サーバーを再起動**
   ```bash
   # Ctrl+C で停止後、再起動
   npm run dev
   ```

4. **ブラウザのキャッシュをクリア**
   - ハードリロード（Ctrl+Shift+R または Cmd+Shift+R）

### 画像が大きすぎる/小さすぎる場合

`src/components/Walkthrough/Walkthrough.module.css` の `.kametaroImage` クラスを調整してください：

```css
.kametaroImage {
  width: 100%;
  height: 100%;
  object-fit: contain;  /* または cover */
  animation: bounce 1s ease-in-out;
  padding: 8px;  /* パディングを調整 */
}
```

---

<div align="center">
Made with ❤️ for かながわく区民まつり
</div>

