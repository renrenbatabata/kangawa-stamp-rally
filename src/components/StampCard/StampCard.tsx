import { useState } from "react";
import { BsInfoCircleFill } from "react-icons/bs";
import styles from "./StampCard.module.css";

interface StampCardProps {
  id: string;
  title: string;
  subTitle: string;
  imgPath: string;
  stampText: string;
  isAcquired?: boolean; // スタンプを獲得済みかどうか
}

const StampCard: React.FC<StampCardProps> = ({ title, subTitle, imgPath, stampText, isAcquired = false }) => {
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [isImageZoomed, setIsImageZoomed] = useState(false);

  const handleCardClick = () => {
    setIsPopupVisible(true);
  };

  const handleClosePopup = () => {
    setIsPopupVisible(false);
  };

  const handleImageClick = () => {
    setIsImageZoomed(true);
  };

  const handleCloseZoomedImage = () => {
    setIsImageZoomed(false);
  };

return (
  <>
    <button type = "button" className={`${styles.stampCard} ${!isAcquired ? styles.notAcquired : ''}`} onClick={handleCardClick}>
      <div className={styles.infoIconWrapper}>
        <BsInfoCircleFill className={styles.infoIcon} />
      </div>
      <div className={styles.stampInfo}>
        <div className={styles.stampStatus}>
            <img
              src={imgPath}
              alt={title}
              className={`${styles.stampImage} ${!isAcquired ? styles.notAcquiredImage : ''}`}
            />
        </div>
        <h2 className={styles.stampTitle}>{title}</h2>
        <h3 className={styles.stampSubTitle}>{subTitle}</h3>
        <div className={`${styles.tapHint} ${!isAcquired ? styles.hintButton : ''}`}>
          <span className={styles.tapHintText}>
            {isAcquired ? 'タップして詳細を見る' : 'ヒントを見る'}
          </span>
        </div>
      </div>
    </button>

    {isPopupVisible && (
      <div className={styles.popupOverlay} onClick={handleClosePopup}>
        <div className={styles.popup} onClick={(e) => e.stopPropagation()}>
          <button type = "button" className={styles.closeButton} onClick={handleClosePopup}>
            &times;
          </button>
          {isAcquired ? (
            <button
              type="button"
              className={styles.imageButton}
              onClick={handleImageClick}
              aria-label="スタンプ画像を拡大表示"
            >
              <img 
                src={imgPath} 
                alt="Stamp Logo" 
                className={styles.popupLogo}
              />
            </button>
          ) : (
            <div className={styles.imageButton}>
              <img 
                src={imgPath} 
                alt="ヒント画像" 
                className={styles.popupLogo}
              />
            </div>
          )}
          <div className={styles.popupTitle}>
            {isAcquired ? title : 'ヒント'}
          </div>
          <p className={styles.popupText}>{stampText}</p>
        </div>
      </div>
    )}

    {isImageZoomed && (
      <button
        type="button"
        className={styles.zoomedImageOverlay}
        onClick={handleCloseZoomedImage}
        onKeyDown={(e) => {
          if (e.key === 'Escape') {
            e.preventDefault();
            handleCloseZoomedImage();
          }
        }}
        aria-label="拡大画像を閉じる（クリックまたはキーを押す）"
      >
        <span 
          className={styles.zoomedCloseButton}
          aria-hidden="true"
        >
          &times;
        </span>
        <div className={styles.zoomedImageContainer}>
          <img 
            src={imgPath} 
            alt={`${title}の拡大画像`}
            className={styles.zoomedImage}
          />
          <div className={styles.zoomedImageCaption}>{title}</div>
        </div>
      </button>
    )}
  </>
);
};

export default StampCard;