import { useNavigate } from "react-router-dom";
import styles from "./ScanResultFailPage.module.css";

// 失敗時のイメージに合わせたアイコンがあればインポート
import failIcon from "../../assets/images/stamp_icon_unachieved.png"; // 仮の失敗アイコン

const ScanResultFailPage: React.FC = () => {
  const navigate = useNavigate();

  // 閉じるボタンがクリックされた時のハンドラー
  const handleCloseClick = () => {
    // カメラページに戻り、再度スキャンを促す
    navigate("/scan");
  };

  return (
    <div className={styles.failPage}>
      <div className={styles.cardContainer}>
        <h1 className={styles.title}>読みとり しっぱい</h1>

        {/* 失敗時のアイコンがあれば表示 */}
        <img src={failIcon} alt="スキャン失敗" className={styles.failImage} />

        <p className={styles.message}>
          QRコードをもう一度
          <br />
          よみとってね
        </p>

        {/* 閉じる（再試行）ボタン */}
        <button className={styles.closeButton} onClick={handleCloseClick}>
          <span className={styles.closeIcon}>✕</span>
        </button>
      </div>
    </div>
  );
};

export default ScanResultFailPage;
