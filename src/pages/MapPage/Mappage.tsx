import Header from "../../components/common/Header/Header";
import FooterNav from "../../components/common/FooterNav/FooterNav";
// import styles from "./MapPage.module.css";

const MapPage: React.FC = () => {
  return (
    <div>
      <Header />

      <p>マップコンテンツ入れる</p>

      <FooterNav homePath="/stamps" cameraPath="/scan" mapPath="/map" />
    </div>
  );
};

export default MapPage;
