import styles from './StampCompletePopup.module.css';
import { GiTrophyCup } from "react-icons/gi";
import { FaGift, FaStar } from "react-icons/fa";
import { MdCelebration } from "react-icons/md";

type StampCompletePopupProps = {
  onClose: () => void;
  totalStamps: number;
};

const StampCompletePopup = ({ onClose, totalStamps }: StampCompletePopupProps) => {
  return (

    <div className={styles.overlay}>
      <div className={styles.popupContainer}>
        <div className={styles.trophyHeader}>
          <GiTrophyCup className={styles.mainTrophyIcon} />
        </div>
        <div className={styles.celebrationAnimation}>
          <MdCelebration className={styles.celebrationIcon} />
          <FaGift className={styles.giftIcon} />
        </div>
        <p className={styles.congratulationsText}>おめでとうございます！</p>
        <div className={styles.completionBox}>
          <div className={styles.boxContent}>
            <p className={styles.boxTitle}><GiTrophyCup className={styles.inlineTrophyIcon} /> スタンプラリー完走！</p>
            <p className={styles.boxMessage}>
              全<span className={styles.highlightText}>{totalStamps}個</span>のスタンプを<br />
              見事にコンプリートしました！
            </p>
            <div className={styles.starsContainer}>
              <FaStar className={styles.starIcon} />
              <FaStar className={styles.starIcon} />
              <GiTrophyCup className={styles.targetIcon} />
              <FaStar className={styles.starIcon} />
              <FaStar className={styles.starIcon} />
            </div>
          </div>
        </div>
        <div className={styles.thanksBox}>
          <div className={styles.boxContent}>
            <p className={styles.boxTitle}><FaGift className={styles.inlineGiftIcon} /> 神奈川区区民まつりを</p>
            <p className={styles.boxMessage}>
              お楽しみいただき<br />
              ありがとうございました！<br />
              案内所でプレゼントを受け取ってね！
            </p>
          </div>
        </div>
        <button type="button" className={styles.checkResultButton} onClick={onClose}>
          もどる
        </button>
      </div>
    </div>
  );
};

export default StampCompletePopup;