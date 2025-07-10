import styles from "./FooterNav.module.css";

//アイコン
import homeIcon from "./icon/home.png";
import mapIcon from "./icon/map.png";
import cameraIcon from "./icon/camera.png";

const FooterNav: React.FC = () => {
  return (
    <div className={styles.footerNav}>
      <div>
        <img src={homeIcon} alt="Home" />
        <p>ホーム</p>
      </div>
      <div>
        <img src={cameraIcon} alt="Camera" />
        <p>カメラ</p>
      </div>
      <div>
        <img src={mapIcon} alt="Map" />
        <p>マップ</p>
      </div>
    </div>
  );
};

export default FooterNav;
