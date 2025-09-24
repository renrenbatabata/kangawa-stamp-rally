import styles from "./StampBadge.module.css";
import { GiTurtle } from "react-icons/gi";
import { useEffect, useState } from "react";
import StampCompletePopup from "./StampCompletePopup/StampCompletePopup";

type StampBadgeProps = {
  progress: number;
};

const StampBadge = ({ progress }: StampBadgeProps) => {
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    if (progress === 4) {
      setShowPopup(true);
    }
  }, [progress]);

  const progressIcons = Array.from({ length: 4 }, (_, index) => {
    const id = index + 1;
    return (
      <div key={id} className={styles.iconWrapper}>
        <GiTurtle className={index < progress ? styles.checkedIcon : styles.unCheckedIcon} />
      </div>
    );
  });

  const progressBarWidth = (progress / 4) * 100;

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  return (
    <div className={styles.Container}>
      <p className={styles.progressKazu}>スタンプ進捗</p>
      
      <div className={styles.progressConteinae}>
        <span className={styles.progress}>{progress}</span>
        <span className={styles.progressSeparator}>/</span>
        <span className={styles.progressTotal}>4</span>
      </div>
      
      <div className={styles.progressBarContainer}>
        <div 
          className={styles.progressBarFill} 
          style={{ width: `${progressBarWidth}%` }}
        ></div>
      </div>

      <div className={styles.iconsContainer}>
        {progressIcons}
      </div>

      {showPopup && <StampCompletePopup onClose={handleClosePopup} totalStamps={4} />}
    </div>
  );
};

export default StampBadge;