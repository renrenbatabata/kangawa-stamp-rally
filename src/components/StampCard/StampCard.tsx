import styles from "./StampCard.module.css";

interface StampCardProps {
  id: number;
  title: string;
  imgPath: string; 
}

// Stamp card component
const StampCard: React.FC<StampCardProps> = ({ title, imgPath }) => {
  return (
    <div className={styles.stampCard}>
      <div className={styles.stampInfo}>
        <p className={styles.stampStatus}>
            <img
              src={imgPath} 
              alt={title}
              className={styles.stampImage}
            />
        </p>
        <h2 className={styles.stampTitle}>{title}</h2>
      </div>
    </div>
  );
};

export default StampCard;