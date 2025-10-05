// React
import { lazy, Suspense, useState, useEffect } from "react";

// サードパーティ
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { SpeedInsights } from "@vercel/speed-insights/react";

// 内部モジュール
import { useUserRegistration } from "./hooks/useUserRegistration";
import { UserContext } from "./hooks/useContext";
import Walkthrough from "./components/Walkthrough/Walkthrough";

// CSS
import "./styles/global.css";

// レイジーローディング
const HomePage = lazy(() => import("./pages/HomePage/HomePage"));
const StampListPage = lazy(() => import("./pages/StampListPage/StampListPage"));
const MapPage = lazy(() => import("./pages/MapPage/MapPage"));
const QuizPage = lazy(() => import("./pages/Quizpage/QuizPage"));
const CameraPage = lazy(() => import("./pages/CameraPage/CameraPage"));
const ScanResultSuccessPage = lazy(
  () => import("./pages/ScanResultSuccessPage/ScanResultSuccessPage")
);
const ScanResultFailPage = lazy(
  () => import("./pages/ScanResultFailPage/ScanResultFailPage")
);

const WALKTHROUGH_KEY = "kanagawa_stamp_rally_walkthrough_completed";

const App: React.FC = () => {
  const { uid, error } = useUserRegistration();
  const [showWalkthrough, setShowWalkthrough] = useState(false);

  useEffect(() => {
    // ウォークスルーが完了しているかチェック
    const walkthroughCompleted = localStorage.getItem(WALKTHROUGH_KEY);
    if (!walkthroughCompleted && uid !== "") {
      setShowWalkthrough(true);
    }
  }, [uid]);

  const handleWalkthroughComplete = () => {
    localStorage.setItem(WALKTHROUGH_KEY, "true");
    setShowWalkthrough(false);
  };

  if (uid === "") {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          padding: "20px",
          backgroundColor: "#FDF5E6",
        }}
      >
        <h1 style={{ color: "#FB9701", marginBottom: "20px" }}>
          ユーザー情報をロード中...
        </h1>
        <p style={{ color: "#555", textAlign: "center" }}>
          初回アクセス時は、ユーザーIDの登録を行っています。
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          padding: "40px",
          textAlign: "center",
          color: "#c0392b",
          backgroundColor: "#fbe2e1",
        }}
      >
        <div
          style={{
            border: "2px solid #c0392b",
            borderRadius: "8px",
            padding: "30px",
            maxWidth: "500px",
            backgroundColor: "white",
          }}
        >
          <h1>接続エラー</h1>
          <p>ユーザー情報の取得または登録中に問題が発生しました。</p>
          <p>
            恐れ入りますが、ネットワーク接続を確認してから、ページを再読み込みしてください。
          </p>
        </div>
      </div>
    );
  }

  return (
    <UserContext.Provider value={uid}>
      <BrowserRouter>
        <SpeedInsights />
        <Suspense
          fallback={
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "100vh",
                backgroundColor: "#FDF5E6",
                color: "#FB9701",
                fontSize: "18px",
                fontWeight: "bold",
              }}
            >
              読み込み中...
            </div>
          }
        >
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
        {showWalkthrough && (
          <Walkthrough onComplete={handleWalkthroughComplete} />
        )}
      </BrowserRouter>
    </UserContext.Provider>
  );
};

export default App;
