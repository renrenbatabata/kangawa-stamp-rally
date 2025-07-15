import "./styles/global.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage/HomePage";
import StampListPage from "./pages/StampListPage/StampListPage";
import MapPage from "./pages/MapPage/Mappage";
import CameraPage from "./pages/CameraPage/CameraPage";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/stamps" element={<StampListPage />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/scan" element={<CameraPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
