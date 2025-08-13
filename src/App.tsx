// src/App.tsx
import "./styles/global.css"; // グローバルCSSをインポート
import React, { useState, useEffect } from "react"; // useStateとuseEffectフックをインポート
import { v4 as uuidv4 } from "uuid"; 
import { BrowserRouter, Route, Routes } from "react-router-dom"; // React Router関連コンポーネントをインポート

// 各ページコンポーネントをインポート
import HomePage from "./pages/HomePage/HomePage";
import StampListPage from "./pages/StampListPage/StampListPage";
import MapPage from "./pages/MapPage/Mappage";
import QuizPage from "./pages/Quizpage/QuizPage";
import CameraPage from "./pages/CameraPage/CameraPage";
import ScanResultSuccessPage from "./pages/ScanResultSuccessPage/ScanResultSuccessPage";
import ScanResultFailPage from "./pages/ScanResultFailPage/ScanResultFailPage";

import { UserContext, UID_LOCAL_STORAGE_KEY } from "./UserContext";

// --- メインの App コンポーネント ---
const App: React.FC = () => {
  // UIDの状態管理: 初回レンダリング時にlocalStorageからUIDを取得し、なければ新しいUUIDを生成
  const [uid] = useState<string>(() => {
    // ブラウザ環境でのみlocalStorageにアクセス
    if (typeof window !== "undefined") {
      const storedUid = localStorage.getItem(UID_LOCAL_STORAGE_KEY);
      if (storedUid) {
        return storedUid; // 既存のUIDを使用
      }
    }
    return uuidv4(); // 新しいUIDを生成
  });

  // uidが変更されるたびにlocalStorageに保存する副作用
  useEffect(() => {
    // ブラウザ環境でのみ実行
    if (typeof window !== "undefined") {
      localStorage.setItem(UID_LOCAL_STORAGE_KEY, uid);
    }
  }, [uid]);
  return (
    <UserContext.Provider value={uid}>
      <BrowserRouter>
        {/* ルーティング設定 */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/stamps" element={<StampListPage />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/quiz" element={<QuizPage />} />
          <Route path="/scan" element={<CameraPage />} />
          <Route path="/scan/success" element={<ScanResultSuccessPage />} />
          <Route path="/scan/fail" element={<ScanResultFailPage />} />
        </Routes>
      </BrowserRouter>
    </UserContext.Provider>
  );
};

export default App; // Appコンポーネントのみをデフォルトエクスポート
