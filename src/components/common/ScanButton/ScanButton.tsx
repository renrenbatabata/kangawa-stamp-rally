import { MdOutlinePhoneIphone } from "react-icons/md";
import styles from './ScanButton.module.css';

interface ScanButtonProps {
  onClick: () => void;
}

const ScanButton: React.FC<ScanButtonProps> = ({ onClick }) => {
  return (
    <div className={styles.container}>
      <button type="button" className={styles.scanButton} onClick={onClick}>
        <div className={styles.iconWrapper}>
          <span className={styles.phoneIcon}><MdOutlinePhoneIphone />
          </span>
        </div>
        <span className={styles.buttonText}>QRコードを読み取る</span>
      </button>
      <p className={styles.instruction}>
        <span className={styles.fingerIcon}>👆</span> 会場のQRコードにカメラを向けてね！
      </p>
    </div>
  );
};

export default ScanButton;