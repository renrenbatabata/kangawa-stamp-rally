import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./ScanResultSuccessPage.module.css";
import background from "../../assets/images/background.png";
import type { Stamp } from "../../types/stamp";

const ScanResultSuccessPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [stampImagePath, setStampImagePath] = useState<string | null>(null);

  useEffect(() => {
    const stampDataFromState = location.state?.stampData as Stamp | undefined;

    if (stampDataFromState?.imgPath) {
      setStampImagePath(stampDataFromState.imgPath);
      console.log("Stateから画像パスを取得:", stampDataFromState.imgPath);
    } else {
      console.warn(
        "ナビゲーションStateから有効なスタンプデータ（imgPath）が見つかりませんでした。デフォルト画像を使用します。"
      );
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