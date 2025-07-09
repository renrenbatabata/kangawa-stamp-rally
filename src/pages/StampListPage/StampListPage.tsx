// import { useEffect, useState } from "react";
import styles from "./StampListPage.module.css";

// 共通コンポーネント
import header from "../../components/common/Header/Header.png";

const StampListPage: React.FC = () => {
  return (
    <div className={styles.container}>
      <header>
        <img src={header} alt="Header" className={styles.header} />
      </header>
      <div>
        <h1 className={styles.title}>スタンプ集めの進捗</h1>
      </div>
    </div>
  );
};

export default StampListPage;
