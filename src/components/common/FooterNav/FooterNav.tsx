import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../../constants/routes";
import styles from "./FooterNav.module.css";

// アイコン
import homeIcon from "../../../assets/icon/home.png";
import mapIcon from "../../../assets/icon/map.png";
import CameraButton from "../CameraButton/CameraButton";

const FooterNav: React.FC = () => {
  const navigate = useNavigate();

  return (
    <footer className={styles.footerNav}>
      <button
        type="button"
        className={`${styles.footerNavItem} ${styles.home}`}
        onClick={() => navigate(ROUTES.STAMPS)}
      >
        <img src={homeIcon} alt="ホーム" />
        <p>ホーム</p>
      </button>

      <div className={styles.cameraButtonContainer}>
        <CameraButton onClick={() => navigate(ROUTES.SCAN)} /> 
      </div>

      <button
        type="button"
        className={`${styles.footerNavItem} ${styles.map}`}
        onClick={() => navigate(ROUTES.MAP)} 
      >
        <img src={mapIcon} alt="マップ" />
        <p>マップ</p>
      </button>
    </footer>
  );
};

export default FooterNav;