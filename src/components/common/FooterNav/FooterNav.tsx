import styles from "./FooterNav.module.css";
import { useNavigate } from "react-router-dom";

//アイコン
import homeIcon from "./icon/home.png";
import mapIcon from "./icon/map.png";
import cameraIcon from "./icon/camera.png";

const FooterNav: React.FC = () => {
  const navigate = useNavigate();

  const handleHomeClick = () => {
    navigate("/stamps");
  };
  const handleMapClick = () => {
    navigate("/map");
  };
  const handleCameraClick = () => {
    navigate("/camera");
  };
  return (
    <div className={styles.footerNav}>
      <button
        className={`${styles.footerNavItem} ${styles.home}`}
        onClick={handleHomeClick}
      >
        <img src={homeIcon} alt="Home" />
        <p>ホーム</p>
      </button>
      <button className={styles.footerNavItem} onClick={handleCameraClick}>
        <div className={styles.camera}>
          <img src={cameraIcon} alt="Camera" />
        </div>
      </button>
      <button
        className={`${styles.footerNavItem} ${styles.map}`}
        onClick={handleMapClick}
      >
        <img src={mapIcon} alt="Map" />
        <p>マップ</p>
      </button>
    </div>
  );
};

export default FooterNav;
