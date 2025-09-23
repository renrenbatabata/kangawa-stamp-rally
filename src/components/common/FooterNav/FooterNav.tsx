import { useNavigate } from "react-router-dom";
import styles from "./FooterNav.module.css";

// アイコン
import homeIcon from "../../../assets/icon/home.png";
import mapIcon from "../../../assets/icon/map.png";
import CameraButton from "../CamaraButton/CameraButton";

// FooterNavのpropsの型を定義
type FooterNavProps = {
  homePath: string;
  cameraPath: string;
  mapPath: string;
};

const FooterNav: React.FC<FooterNavProps> = ({ homePath, cameraPath, mapPath }) => {
  const navigate = useNavigate();

  return (
    <footer className={styles.footerNav}>
      <button
        type="button"
        className={`${styles.footerNavItem} ${styles.home}`}
        onClick={() => navigate(homePath)}
      >
        <img src={homeIcon} alt="ホーム" />
        <p>ホーム</p>
      </button>

      <div className={styles.cameraButtonContainer}>
        <CameraButton onClick={() => navigate(cameraPath)} /> 
      </div>

      <button
        type="button"
        className={`${styles.footerNavItem} ${styles.map}`}
        onClick={() => navigate(mapPath)} 
      >
        <img src={mapIcon} alt="マップ" />
        <p>マップ</p>
      </button>
    </footer>
  );
};

export default FooterNav;