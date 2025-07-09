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
      <h1>スタンプ一覧ページ</h1>
    </div>
  );
};

export default StampListPage;
