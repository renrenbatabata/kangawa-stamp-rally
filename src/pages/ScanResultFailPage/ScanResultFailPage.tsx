import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../constants/routes";
import styles from "./ScanResultFailPage.module.css";
import background from "../../assets/images/background.png";

// 失敗時のイメージに合わせたアイコンがあればインポート
import failIcon from "../../assets/images/stamp_icon_unachieved.png"; // 仮の失敗アイコン

const ScanResultFailPage: React.FC = () => {
  const navigate = useNavigate();

  // 閉じるボタンがクリックされた時のハンドラー
  const handleCloseClick = () => {
    // カメラページに戻り、再度スキャンを促す
    navigate(ROUTES.SCAN);
  };

  return (
    <div
      className={styles.failPage}
      style={{ backgroundImage: `url(${background})` }}
    >
      <div className={styles.cardContainer}>
        <h1 className={styles.title}>読みとり しっぱい</h1>

        {/* 失敗時のアイコンがあれば表示 */}
        <img src={failIcon} alt="スキャン失敗" className={styles.failImage} loading="lazy" />

        <p className={styles.message}>
          QRコードをもう一度
          <br />
          よみとってね
        </p>

        {/* 閉じる（再試行）ボタン */}
        <button type="button" className={styles.closeButton} onClick={handleCloseClick}>
          <span className={styles.closeIcon}>✕</span>
        </button>
      </div>
    </div>
  );
};

export default ScanResultFailPage;
