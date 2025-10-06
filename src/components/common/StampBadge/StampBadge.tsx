import styles from "./StampBadge.module.css";
import { GiTurtle } from "react-icons/gi";
import { useEffect, useState } from "react";
import StampCompletePopup from "./StampCompletePopup/StampCompletePopup";

type StampBadgeProps = {
  progress: number;
};

const POPUP_SEEN_KEY = 'stampRallyCompletedPopupSeen';

const StampBadge = ({ progress }: StampBadgeProps) => {
  const totalStamps = 4;
  const remainingStamps = totalStamps - progress;
  
  const [showPopup, setShowPopup] = useState(false); 

  useEffect(() => {
    const isCompleted = progress === totalStamps;
    
    const hasPopupBeenSeen = localStorage.getItem(POPUP_SEEN_KEY) === 'true';

    if (isCompleted && !hasPopupBeenSeen) {
      setShowPopup(true);
    }
    
  }, [progress]); 

  const progressIcons = Array.from({ length: totalStamps }, (_, index) => {
    const id = index + 1;
    return (
      <div key={id} className={styles.iconWrapper}>
        <GiTurtle className={index < progress ? styles.checkedIcon : styles.unCheckedIcon} />
      </div>
    );
  });

  const progressBarWidth = (progress / totalStamps) * 100;

  const handleClosePopup = () => {
    setShowPopup(false);
    localStorage.setItem(POPUP_SEEN_KEY, 'true');
  };

  return (
    <div className={styles.Container}>
      <div className={styles.progressText}>スタンプ進捗</div>
      <div className={styles.innerBox}>
        <div className={styles.progressContainer}>
          <span className={styles.progress}>{progress}</span>
          <span className={styles.progressSeparator}>/</span>
          <span className={styles.progressTotal}>{totalStamps}</span>
        </div>
        <div className={styles.progressBarContainer}>
          <div
            className={styles.progressBarFill}
            style={{ width: `${progressBarWidth}%` }}
          ></div>
        </div>
        {progress === totalStamps ? (
          <p className={styles.remainingMessage}>
            おめでとうございます！<br />
            <span className={styles.boothHighlight}>22番ブース</span>でプレゼントを受け取ってね！
          </p>
        ) : (
          <p className={styles.remainingMessage}>
            コンプリートまであと {remainingStamps} 個！
          </p>
        )}
        <div className={styles.iconsContainer}>
          {progressIcons}
        </div>
      </div>
      {showPopup && <StampCompletePopup onClose={handleClosePopup} totalStamps={totalStamps} />}
    </div>
  );
};

export default StampBadge;