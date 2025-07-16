// 各スタンプカードの表示コンポーネント

import styles from "./StampCard.module.css";
// スタンプ画像のパスを定義
import Stamp01 from "../../assets/stamp_points/stamp_point_ 1.png";
import Stamp02 from "../../assets/stamp_points/stamp_point_ 2.png";
import Stamp03 from "../../assets/stamp_points/stamp_point_ 3.png";
import Stamp04 from "../../assets/stamp_points/stamp_point_ 4.png";
import Stamp05 from "../../assets/stamp_points/stamp_point_ 5.png";
import Stamp06 from "../../assets/stamp_points/stamp_point_ 6.png";
import StampUnComplete from "../../assets/images/stamp_icon_unachieved.png";

const Stamp: { [key in "1" | "2" | "3" | "4" | "5" | "6"]: string } = {
  1: Stamp01,
  2: Stamp02,
  3: Stamp03,
  4: Stamp04,
  5: Stamp05,
  6: Stamp06,
};

interface StampCardProps {
  id: number;
  title: string;
  completed: boolean;
}
// スタンプカードコンポーネント
const StampCard: React.FC<StampCardProps> = ({ id, title, completed }) => {
  return (
    <div className={styles.stampCard}>
      <div className={styles.stampInfo}>
        <p className={styles.stampStatus}>
          {completed ? (
            <img
              src={Stamp[id.toString() as keyof typeof Stamp]}
              alt={title}
              className={styles.stampImage}
            />
          ) : (
            <img
              src={StampUnComplete}
              alt={title}
              className={styles.stampImage}
            />
          )}
        </p>
        <h2 className={styles.stampTitle}>{title}</h2>
      </div>
    </div>
  );
};

export default StampCard;
