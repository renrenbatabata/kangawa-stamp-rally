import "./styles/global.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage/HomePage";
import StampListPage from "./pages/StampListPage/StampListPage";
import MapPage from "./pages/MapPage/Mappage";
import QuizPage from "./pages/Quizpage/QuizPage";
import CameraPage from "./pages/CameraPage/CameraPage";
import ScanResultSuccessPage from "./pages/ScanResultSuccessPage/ScanResultSuccessPage";
import ScanResultFailPage from "./pages/ScanResultFailPage/ScanResultFailPage";

const App: React.FC = () => {
  return (
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
  );
};

export default App;
