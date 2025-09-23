// src/App.tsx
import "./styles/global.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";

// 各ページコンポーネントをインポート
import HomePage from "./pages/HomePage/HomePage";
import StampListPage from "./pages/StampListPage/StampListPage";
import MapPage from "./pages/MapPage/Mappage";
import QuizPage from "./pages/Quizpage/QuizPage";
import CameraPage from "./pages/CameraPage/CameraPage";
import ScanResultSuccessPage from "./pages/ScanResultSuccessPage/ScanResultSuccessPage";
import ScanResultFailPage from "./pages/ScanResultFailPage/ScanResultFailPage";

// カスタムフックをインポート
import { useUserRegistration } from "./hooks/useUserRegistration";
import { UserContext } from "./hooks/useContext";

// --- メインの App コンポーネント ---
const App: React.FC = () => {
  const { uid } = useUserRegistration();

  if (!uid) {
    return <div>ロード中...</div>;
  }

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

export default App;