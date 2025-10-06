// React
import { lazy, Suspense, useState, useEffect } from "react";

// サードパーティ
import { BrowserRouter, Route, Routes, useNavigate, useLocation } from "react-router-dom";
import { SpeedInsights } from "@vercel/speed-insights/react";

// 内部モジュール
import { useUserRegistration } from "./hooks/useUserRegistration";
import { UserContext } from "./hooks/useContext";
import Walkthrough from "./components/Walkthrough/Walkthrough";
import { WALKTHROUGH_KEY } from "./utils/walkthroughEvents";

// CSS
import "./styles/global.css";
import styles from "./App.module.css";

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

// ルート内で使用するコンポーネント
const AppRoutes: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { uid, error } = useUserRegistration();
  const [showWalkthrough, setShowWalkthrough] = useState(false);
  const [isFirstTime, setIsFirstTime] = useState(false);

  useEffect(() => {
    // ウォークスルーが完了しているかチェック
    const walkthroughCompleted = localStorage.getItem(WALKTHROUGH_KEY);
    if (!walkthroughCompleted && uid !== "") {
      setShowWalkthrough(true);
      setIsFirstTime(true);  // 初回アクセスフラグ
    }
  }, [uid]);

  useEffect(() => {
    // カスタムイベントでウォークスルーを表示
    const handleShowWalkthrough = () => {
      setShowWalkthrough(true);
      setIsFirstTime(false);  // 手動表示の場合は初回ではない
    };

    window.addEventListener('showWalkthrough', handleShowWalkthrough);
    return () => {
      window.removeEventListener('showWalkthrough', handleShowWalkthrough);
    };
  }, []);

  const handleWalkthroughComplete = () => {
    localStorage.setItem(WALKTHROUGH_KEY, "true");
    setShowWalkthrough(false);
    
    // 初回アクセスの場合は、スタンプリストページに直接遷移
    if (isFirstTime && location.pathname === '/') {
      navigate('/stamps', { replace: true });
    }
  };

  if (uid === "") {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <h1 className={styles.loadingTitle}>
          ユーザー情報をロード中...
        </h1>
        <p className={styles.loadingDescription}>
          初回アクセス時は、ユーザーIDの登録を行っています。
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorCard}>
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
      <SpeedInsights />
      <Suspense
        fallback={
          <div className={styles.loadingContainer}>
            <div className={styles.spinner}></div>
            <h1 className={styles.loadingTitle}>読み込み中...</h1>
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
    </UserContext.Provider>
  );
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
};

export default App;
