import { useState } from "react";
import { BsInfoCircleFill } from "react-icons/bs";
import styles from "./StampCard.module.css";

interface StampCardProps {
  id: string;
  title: string;
  subTitle: string;
  imgPath: string;
  stampText: string;
}

const StampCard: React.FC<StampCardProps> = ({ title, subTitle, imgPath, stampText }) => {
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  const handleCardClick = () => {
    setIsPopupVisible(true);
  };

  const handleClosePopup = () => {
    setIsPopupVisible(false);
  };

return (
  <>
    <button type = "button" className={styles.stampCard} onClick={handleCardClick}>
      <div className={styles.infoIconWrapper}>
        <BsInfoCircleFill className={styles.infoIcon} />
      </div>
      <div className={styles.stampInfo}>
        <div className={styles.stampStatus}>
            <img
              src={imgPath}
              alt={title}
              className={styles.stampImage}
            />
        </div>
        <h2 className={styles.stampTitle}>{title}</h2>
        <h3 className={styles.stampSubTitle}>{subTitle}</h3>
        <div className={styles.tapHint}>
          <span className={styles.tapHintText}>タップして詳細を見る</span>
        </div>
      </div>
    </button>

    {isPopupVisible && (
      <div className={styles.popupOverlay}>
        <div className={styles.popup}>
          <button type = "button" className={styles.closeButton} onClick={handleClosePopup}>
            &times;
          </button>
          <img src={imgPath} alt="Stamp Logo" className={styles.popupLogo} />
          <div className={styles.popupTitle}>{title}</div>
          <p className={styles.popupText}>{stampText}</p>
        </div>
      </div>
    )}
  </>
);
};

export default StampCard;