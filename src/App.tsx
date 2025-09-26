import "./styles/global.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import HomePage from "./pages/HomePage/HomePage";
import StampListPage from "./pages/StampListPage/StampListPage";
import MapPage from "./pages/MapPage/Mappage";
import QuizPage from "./pages/Quizpage/QuizPage";
import CameraPage from "./pages/CameraPage/CameraPage";
import ScanResultSuccessPage from "./pages/ScanResultSuccessPage/ScanResultSuccessPage";
import ScanResultFailPage from "./pages/ScanResultFailPage/ScanResultFailPage";

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
}

export default App;
