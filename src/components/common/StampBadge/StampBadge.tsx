import styles from "./StampBadge.module.css";

type StampBadgeProps = {
  progress: number;
};

const StampBadge = ({ progress }: StampBadgeProps) => {
  return (
    <div className={styles.Container}>
      <p className={styles.progressKazu}>取得したスタンプ数</p>
      <div className={styles.progressConteinae}>
        <span className={styles.progress}>{progress}</span>
        <span className={styles.progressSeparator}>/</span>
        <span className={styles.progressTotal}>4</span>
      </div>
    </div>
  );
};

export default StampBadge;
