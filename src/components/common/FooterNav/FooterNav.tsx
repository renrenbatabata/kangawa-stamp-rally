import styles from "./FooterNav.module.css";

//アイコン
import homeIcon from "./icon/home.png";
import mapIcon from "./icon/map.png";
import cameraIcon from "./icon/camera.png";

const FooterNav: React.FC = () => {
  return (
    <div className={styles.footerNav}>
      <button className={`${styles.footerNavItem} ${styles.home}`}>
        <img src={homeIcon} alt="Home" />
        <p>ホーム</p>
      </button>
      <button className={styles.footerNavItem}>
        <div className={styles.camera}>
          <img src={cameraIcon} alt="Camera" />
        </div>
      </button>
      <button className={`${styles.footerNavItem} ${styles.map}`}>
        <img src={mapIcon} alt="Map" />
        <p>マップ</p>
      </button>
    </div>
  );
};

export default FooterNav;
