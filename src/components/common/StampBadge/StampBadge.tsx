import styles from "./StampBadge.module.css";

type StampBadgeProps = {
  progress: number;
};

const StampBadge = ({ progress }: StampBadgeProps) => {
  return (
    <div className={styles.cuteBadgeContainer}>
      <div className={styles.cuteBadge}>
        <span className={styles.progressCurrent}>{progress}</span>
        <span className={styles.progressSeparator}>/</span>
        <span className={styles.progressTotal}>6</span>
      </div>
    </div>
  );
};

export default StampBadge;
