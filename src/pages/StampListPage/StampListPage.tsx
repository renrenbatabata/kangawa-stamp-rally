import { useState, useEffect } from "react";
import { useUserContext } from "../../UserContext";
import styles from "./StampListPage.module.css";
import type { Stamp } from "../../types/stamp";

// 共通コンポーネント
import Header from "../../components/common/Header/Header";
import FooterNav from "../../components/common/FooterNav/FooterNav";
import StampBadge from "../../components/common/StampBadge/StampBadge";
import QRtitle from "../../assets/images/QRtitle.png";
import StampList from "../../components/StampList/StampList";

const StampListPage: React.FC = () => {
  const uid = useUserContext();
  console.log("User UID:", uid);

  const [stamps, setStamps] = useState<Stamp[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStamps = async () => {
      try {
        const response = await fetch("/data/top_mock.json");
        if (!response.ok) {
          throw new Error("Failed to fetch mock data.");
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
  }, []);

  const progress = stamps.length;

  if (isLoading) {
    return (
      <div className={styles.container}>
        <Header />
        <div className={styles.messageContainer}>
          <p>読み込み中...</p>
        </div>
        <FooterNav homePath="/stamps" cameraPath="/scan" mapPath="/map" />
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
        <FooterNav homePath="/stamps" cameraPath="/scan" mapPath="/map" />

      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Header />

        <img src={QRtitle} className={styles.qrTitleImage} alt="QRコードを読み取ってスタンプゲット！" />

        <div className={styles.progressContainer}>
          <StampBadge progress={progress} />
        </div>

        <StampList stamps={stamps} />
      <FooterNav homePath="/stamps" cameraPath="/scan" mapPath="/map" />
    </div>
  );
};

export default StampListPage;