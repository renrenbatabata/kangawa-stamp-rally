import Header from "../../components/common/Header/Header";
import FooterNav from "../../components/common/FooterNav/FooterNav";
// import styles from "./MapPage.module.css";

const MapPage: React.FC = () => {
  return (
    <div>
      {/* ヘッダーコンポーネント */}
      <Header />

      {/* マップのコンテンツ */}
      <p>マップコンテンツ入れる</p>

      {/* フッターのナビゲーション */}
      <FooterNav />
    </div>
  );
};

export default MapPage;
