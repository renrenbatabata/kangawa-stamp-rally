import styles from "./CameraButton.module.css";

import cameraIcon from "./icon/camera.png";

function CameraButton({ onClick }: { onClick: () => void }) {
  // カメラボタンがクリックされたときのハンドラー

  return (
    <div className={styles.cameraButton}>
      <button className={styles.footerNavItem} onClick={onClick}>
        <div className={styles.camera}>
          <img src={cameraIcon} alt="Camera" />
        </div>
      </button>
    </div>
  );
}

export default CameraButton;
