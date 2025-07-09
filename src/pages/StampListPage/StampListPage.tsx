// import { useEffect, useState } from "react";
import styles from "./StampListPage.module.css";

// 共通コンポーネント
import header from "../../components/common/Header/Header.png";

// スタンプ画像
import uncomplete from "../../assets/images/stamp_icon_uncomplete.png";
import complete from "../../assets/images/stamp_icon_complete.png";

const StampListPage: React.FC = () => {
  return (
    <div className={styles.container}>
      <header>
        <img src={header} alt="Header" className={styles.header} />
      </header>
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
    </div>
  );
};

export default StampListPage;
