import styles from './StampCompletePopup.module.css'; // CSS Modulesを使用
import { GiTrophyCup } from "react-icons/gi"; // トロフィーアイコン
import { FaGift, FaStar } from "react-icons/fa"; // 花火、ギフト、星アイコン (例として)
import { MdCelebration } from "react-icons/md"; // お祝いのアイコン (例として)

type StampCompletePopupProps = {
  onClose: () => void; // ポップアップを閉じるための関数
  totalStamps: number; // 総スタンプ数
};

const StampCompletePopup = ({ onClose, totalStamps }: StampCompletePopupProps) => {
  return (
    <div className={styles.overlay}>
      <div className={styles.popupContainer}>
        {/* 上部のトロフィーアイコンと背景 */}
        <div className={styles.trophyHeader}>
          <GiTrophyCup className={styles.mainTrophyIcon} />
        </div>

        {/* お祝いのメッセージ */}
        <div className={styles.celebrationAnimation}>
          <MdCelebration className={styles.celebrationIcon} />
          <FaGift className={styles.giftIcon} />
        </div>
        <p className={styles.congratulationsText}>おめでとうございます！</p>

        {/* スタンプラリー完走ボックス */}
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
              {/* 真ん中のターゲットアイコンを表現するためにGiTurtleを流用、または別途アイコンを用意 */}
              <GiTrophyCup className={styles.targetIcon} /> {/* 例: トロフィーをターゲットとして利用 */}
              <FaStar className={styles.starIcon} />
              <FaStar className={styles.starIcon} />
            </div>
          </div>
        </div>

        {/* イベント感謝ボックス */}
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

        {/* 結果を確認するボタン */}
        <button type="button" className={styles.checkResultButton} onClick={onClose}>
          もどる
        </button>
      </div>
    </div>
  );
};

export default StampCompletePopup;