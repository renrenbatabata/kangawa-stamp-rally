/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import viteCompression from 'vite-plugin-compression';
import viteImagemin from 'vite-plugin-imagemin';

// https://vite.dev/config/
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
const dirname = typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
export default defineConfig({
  plugins: [
    react(),
    // Gzip圧縮
    viteCompression({
      verbose: true,
      disable: false,
      threshold: 10240, // 10KB以上のファイルを圧縮
      algorithm: 'gzip',
      ext: '.gz',
    }),
    // Brotli圧縮（より効率的）
    viteCompression({
      verbose: true,
      disable: false,
      threshold: 10240,
      algorithm: 'brotliCompress',
      ext: '.br',
    }),
    // 画像最適化
    viteImagemin({
      gifsicle: {
        optimizationLevel: 7,
        interlaced: false,
      },
      optipng: {
        optimizationLevel: 7,
      },
      mozjpeg: {
        quality: 80,
      },
      pngquant: {
        quality: [0.8, 0.9],
        speed: 4,
      },
      svgo: {
        plugins: [
          {
            name: 'removeViewBox',
            active: false,
          },
          {
            name: 'removeEmptyAttrs',
            active: false,
          },
        ],
      },
    }),
  ],
  // ビルド最適化設定
  build: {
    // チャンク分割の最適化
    rollupOptions: {
      output: {
        manualChunks: {
          // React関連を1つのチャンクに
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          // QRコード関連を別チャンクに
          'qr-vendor': ['@zxing/browser', '@zxing/library', 'react-zxing'],
          // その他のライブラリ
          'misc-vendor': ['uuid', '@vercel/speed-insights'],
        },
        // ファイル名の最適化
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
    },
    // チャンクサイズ警告の閾値を調整
    chunkSizeWarningLimit: 1000,
    // ソースマップは本番では無効化（サイズ削減）
    sourcemap: false,
    // CSSコード分割を有効化
    cssCodeSplit: true,
    // minify設定
    minify: 'esbuild',
    // ターゲットブラウザの設定
    target: 'es2015',
  },
  // 依存関係の最適化
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@zxing/browser',
      '@zxing/library',
    ],
  },
  test: {
    projects: [{
      extends: true,
      plugins: [
      // The plugin will run tests for the stories defined in your Storybook config
      // See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
      storybookTest({
        configDir: path.join(dirname, '.storybook')
      })],
      test: {
        name: 'storybook',
        browser: {
          enabled: true,
          headless: true,
          provider: 'playwright',
          instances: [{
            browser: 'chromium'
          }]
        },
        setupFiles: ['.storybook/vitest.setup.ts']
      }
    }]
  }
});