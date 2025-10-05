// React
import { useState, useEffect } from "react";

// サードパーティ
import { useNavigate, useLocation } from "react-router-dom";

// 内部モジュール
import type { Stamp } from "../../types/stamp";

// アセット
import background from "../../assets/images/background.png";

// CSS
import styles from "./ScanResultSuccessPage.module.css";

const ScanResultSuccessPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [stampImagePath, setStampImagePath] = useState<string | null>(null);

  useEffect(() => {
    const stampDataFromState = location.state?.stampData as Stamp | undefined;

    if (stampDataFromState?.imgPath) {
      setStampImagePath(stampDataFromState.imgPath);
    }
  }, [location]);

  const handleCloseClick = () => {
    navigate("/stamps");
  };

  const displayedStampPath = stampImagePath ?? undefined;

  return (
    <div
      className={styles.successPage}
      style={{ backgroundImage: `url(${background})` }}
    >
      <div className={styles.cardContainer}>
        <h1 className={styles.title}>スタンプゲット!!</h1>
        <img
          src={displayedStampPath}
          alt="スタンプゲット成功！"
          className={styles.stampImage}
        />
        <button
          type="button"
          className={styles.closeButton}
          onClick={handleCloseClick}
        >
          <span className={styles.closeIcon}>✕</span>
        </button>
      </div>
    </div>
  );
};

export default ScanResultSuccessPage;