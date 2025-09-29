import "./styles/global.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import React, { lazy, Suspense } from "react";
import { SpeedInsights } from "@vercel/speed-insights/react"
const HomePage = lazy(() => import("./pages/HomePage/HomePage"));
const StampListPage = lazy(() => import("./pages/StampListPage/StampListPage"));
const MapPage = lazy(() => import("./pages/MapPage/Mappage"));
const QuizPage = lazy(() => import("./pages/Quizpage/QuizPage"));
const CameraPage = lazy(() => import("./pages/CameraPage/CameraPage"));
const ScanResultSuccessPage = lazy(
  () => import("./pages/ScanResultSuccessPage/ScanResultSuccessPage")
);
const ScanResultFailPage = lazy(
  () => import("./pages/ScanResultFailPage/ScanResultFailPage")
);

import { useUserRegistration } from "./hooks/useUserRegistration";
import { UserContext } from "./hooks/useContext";

const App: React.FC = () => {
  const { uid, error } = useUserRegistration();

  if (uid === "") {
    return (
      <div className="loading-screen">
        <h1>ユーザー情報をロード中...</h1>
        <p>初回アクセス時は、ユーザーIDの登録を行っています。</p>
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "40px",
          color: "#c0392b",
          backgroundColor: "#fbe2e1",
          border: "2px solid #c0392b",
          borderRadius: "8px",
        }}
      >
        <h1>接続エラー</h1>
        <p>ユーザー情報の取得または登録中に問題が発生しました。</p>
        <p>
          恐れ入りますが、ネットワーク接続を確認してから、ページを再読み込みしてください。
        </p>
      </div>
    );
  }

  return (
    <UserContext.Provider value={uid}>
      <BrowserRouter>
        <SpeedInsights />
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/stamps" element={<StampListPage />} />
            <Route path="/map" element={<MapPage />} />
            <Route path="/quiz" element={<QuizPage />} />
            <Route path="/scan" element={<CameraPage />} />
            <Route path="/scan/success" element={<ScanResultSuccessPage />} />
            <Route path="/scan/fail" element={<ScanResultFailPage />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </UserContext.Provider>
  );
};

export default App;
