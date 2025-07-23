import { useNavigate } from "react-router-dom";
import styles from "./ScanResultSuccessPage.module.css";

import background from "../../assets/images/background.png";

// 獲得済みスタンプの画像アセットをインポート
// import stampAchievedImage from "../../assets/images/stamp_icon_achieved.png"; // 成功時のスタンプロゴ

// スタンプ画像のパスを定義
import Stamp01 from "../../assets/stamp_points/stamp_point_1.png";
import Stamp02 from "../../assets/stamp_points/stamp_point_2.png";
import Stamp03 from "../../assets/stamp_points/stamp_point_3.png";
import Stamp04 from "../../assets/stamp_points/stamp_point_4.png";
import Stamp05 from "../../assets/stamp_points/stamp_point_5.png";
import Stamp06 from "../../assets/stamp_points/stamp_point_6.png";

const ScanResultSuccessPage: React.FC = () => {
  const navigate = useNavigate();

  // 「X」ボタンがクリックされた時のハンドラー
  const handleCloseClick = () => {
    // スタンプ一覧ページに戻る、または任意のページへ遷移
    navigate("/stamps");
  };

  // スタンプ画像の配列を定義
  const stamps = [Stamp01, Stamp02, Stamp03, Stamp04, Stamp05, Stamp06];

  return (
    <div
      className={styles.successPage}
      style={{ backgroundImage: `url(${background})` }}
    >
      <div className={styles.cardContainer}>
        <h1 className={styles.title}>スタンプゲット!!</h1>

        {/* 獲得したスタンプの画像を表示 */}
        <img
          src={stamps[Math.floor(Math.random() * stamps.length)]}
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
