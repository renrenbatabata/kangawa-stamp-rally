import styles from "./StampListPage.module.css";
import { useUserContext } from "../../UserContext";

// 共通コンポーネント
import Header from "../../components/common/Header/Header";
import StampCard from "../../components/StampCard/StampCard";
import FooterNav from "../../components/common/FooterNav/FooterNav";
import StampBadge from "../../components/common/StampBadge/StampBadge";
import QRtitle from "../../assets/images/QRtitle.png";
import Stamptyoutitle from "../../assets/images/titlestamp.png";

const StampListPage: React.FC = () => {
  const uid = useUserContext(); // UserContextからUIDを取得
  console.log("User UID:", uid); // UIDをコンソールに出力（デバッグ用）
  // スタンプの一覧を管理する状態
  const stamps = [
    { id: 1, title: "スタンプ1", completed: true },
    { id: 2, title: "スタンプ2", completed: true },
    { id: 3, title: "スタンプ3", completed: true },
    { id: 4, title: "スタンプ4", completed: true },
    { id: 5, title: "スタンプ5", completed: true },
    { id: 6, title: "スタンプ6", completed: true },
  ];

  // スタンプの進捗を計算
  const progress = stamps.filter((stamp) => stamp.completed).length;

  return (
    <div className={styles.container}>
      {/* ヘッダーコンポーネント */}
      <Header />

      {/* スタンプ集めの進捗を表示するコンポーネント */}
      <img src={QRtitle} />

      <div className={styles.progressContainer}>
        <StampBadge progress={progress} />
      </div>

      {/* スタンプの一覧を表示するコンポーネント */}
      <div className={styles.stampListContainer}>
        <img src={Stamptyoutitle} className={styles.listTitle} />

        <div className={styles.stampList}>
          {stamps.map((stamp) => (
            <StampCard
              id={stamp.id}
              title={stamp.title}
              completed={stamp.completed}
            />
          ))}
        </div>
      </div>

      {/* フッターのナビゲーション */}

      <FooterNav />
    </div>
  );
};

export default StampListPage;
