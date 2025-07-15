import { useNavigate } from "react-router-dom";
import styles from "./ScanResultSuccessPage.module.css";

// 獲得済みスタンプの画像アセットをインポート
import stampAchievedImage from "../../assets/images/stamp_icon_achieved.png"; // 成功時のスタンプロゴ

const ScanResultSuccessPage: React.FC = () => {
  const navigate = useNavigate();

  // 「X」ボタンがクリックされた時のハンドラー
  const handleCloseClick = () => {
    // スタンプ一覧ページに戻る、または任意のページへ遷移
    navigate("/stamps");
  };

  return (
    <div className={styles.successPage}>
      <div className={styles.cardContainer}>
        <h1 className={styles.title}>スタンプゲット!!</h1>

        {/* 獲得したスタンプの画像を表示 */}
        <img
          src={stampAchievedImage}
          alt="スタンプゲット成功！"
          className={styles.stampImage}
        />

        {/* 閉じるボタン */}
        <button className={styles.closeButton} onClick={handleCloseClick}>
          <span className={styles.closeIcon}>✕</span>
        </button>
      </div>
    </div>
  );
};

export default ScanResultSuccessPage;
