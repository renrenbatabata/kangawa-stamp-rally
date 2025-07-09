// 各スタンプカードの表示コンポーネント

import Stamp from "../../assets/images/stamp_icon_achieved.png";
import styles from "./StampCard.module.css";

const StampCard: React.FC = () => {
  return (
    <div className={styles.stampCard}>
      <img src={Stamp} alt="Stamp" className={styles.stampImage} />
      <div className={styles.stampInfo}>
        <h2 className={styles.stampTitle}>スタンプタイトル</h2>
      </div>
    </div>
  );
};

export default StampCard;
