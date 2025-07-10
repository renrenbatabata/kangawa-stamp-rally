// import { useEffect, useState } from "react";
import styles from "./StampListPage.module.css";

// 共通コンポーネント
import header from "../../components/common/Header/Header.png";
import StampCard from "../../components/StampCard/StampCard";
import FooterNav from "../../components/common/FooterNav/FooterNav";

// スタンプ画像
import uncomplete from "../../assets/images/stamp_icon_uncomplete.png";
import complete from "../../assets/images/stamp_icon_complete.png";

const StampListPage: React.FC = () => {
  return (
    <div className={styles.container}>
      <header>
        <img src={header} alt="Header" className={styles.header} />
      </header>

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
        <h1 className={styles.title}>スタンプ一覧</h1>
        <div className={styles.stampList}>
          <StampCard />
          <StampCard />
          <StampCard />
          <StampCard />
          <StampCard />
          <StampCard />
        </div>
      </div>

      {/* フッターのナビゲーション */}
      <footer>
        <FooterNav />
      </footer>
    </div>
  );
};

export default StampListPage;
