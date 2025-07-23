import styles from "./StampListPage.module.css";
import { useUserContext } from "../../UserContext";

// 共通コンポーネント
import Header from "../../components/common/Header/Header";
import StampCard from "../../components/StampCard/StampCard";
import FooterNav from "../../components/common/FooterNav/FooterNav";

// スタンプ画像
import uncomplete from "../../assets/images/stamp_icon_uncomplete.png";
import complete from "../../assets/images/stamp_icon_complete.png";

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

  return (
    <div className={styles.container}>
      {/* ヘッダーコンポーネント */}
      <Header />

      {/* スタンプ集めの進捗を表示するコンポーネント */}
      <div className={styles.stampCompleteContainer}>
        <h1 className={styles.title}>スタンプ集めの進捗</h1>
        <div className={styles.stampCompleteLists}>
          <img src={uncomplete} alt="Uncomplete Stamp" />
          <img src={uncomplete} alt="Uncomplete Stamp" />
          <img src={uncomplete} alt="Uncomplete Stamp" />
          <img src={uncomplete} alt="Uncomplete Stamp" />
          <img src={uncomplete} alt="Uncomplete Stamp" />
          <img src={complete} alt="Complete Stamp" />
        </div>
      </div>

      {/* スタンプの一覧を表示するコンポーネント */}
      <div className={styles.stampListContainer}>
        <h1 className={styles.listTitle}>スタンプ一覧</h1>
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
