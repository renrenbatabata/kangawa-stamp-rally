// React
import { useState, useEffect } from "react";

// サードパーティ
import { useNavigate } from "react-router-dom";

// 内部モジュール
import { useUserContext } from "../../hooks/useContext";
import { ROUTES } from "../../constants/routes";
import type { Stamp } from "../../types/stamp";
import Header from "../../components/common/Header/Header";
import FooterNav from "../../components/common/FooterNav/FooterNav";
import StampBadge from "../../components/common/StampBadge/StampBadge";
import StampList from "../../components/StampList/StampList";
import ScanButton from "../../components/common/ScanButton/ScanButton";

// アセット
import QRtitle from "../../assets/images/QRtitle.png";

// CSS
import styles from "./StampListPage.module.css";

const StampListPage: React.FC = () => {
  const uid = useUserContext();
  const navigate = useNavigate();

  const [stamps, setStamps] = useState<Stamp[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const isMockData = import.meta.env.VITE_USE_MOCK_DATA === "true";
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

    const fetchStamps = async () => {
      setError(null);
      setIsLoading(true);

      try {
        if (!isMockData && !apiBaseUrl) {
          throw new Error("API base URL is not configured in environment variables.");
        }

        const url = isMockData ? "/data/top_mock.json" : `${apiBaseUrl}/top?uuid=${uid}`;

        if (!url) {
            throw new Error("Data source URL is not available.");
        }

        const headers: HeadersInit = { 'Content-Type': 'application/json' };

        const response = await fetch(url, {
            method: 'GET',
            headers: headers,
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        setStamps(data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(`Data Fetch Error: ${err.message}`);
        } else {
          setError("An unknown error occurred.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchStamps();
  }, [uid]);

  const progress = stamps.length;

  if (isLoading) {
    return (
      <div className={styles.container}>
        <Header />
        <div className={styles.messageContainer}>
          <div className={styles.spinner}></div>
          <p className={styles.loadingText}>読み込み中...</p>
        </div>
        <FooterNav />
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <Header />
        <div className={styles.messageContainer}>
          <p>{error}</p>
        </div>
        <FooterNav />

      </div>
    );
  }

    const handleScanButtonClick = () => {
    navigate(ROUTES.SCAN);
  };

  return (
    <div className={styles.container}>
      <Header />
      <div className={styles.qrTitleContainer}>
        <img src={QRtitle} className={styles.qrTitleImage} alt="QRコードを読み取ってスタンプゲット！" />
        </div>
        <div className={styles.progressContainer}>
          <StampBadge progress={progress} />
        </div>
              <ScanButton onClick={handleScanButtonClick} />

        <StampList stamps={stamps} />
      <FooterNav />
    </div>
  );
};

export default StampListPage;