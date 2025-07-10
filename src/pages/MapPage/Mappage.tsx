import header from "../../components/common/Header/Header.png";
import styles from "./MapPage.module.css";

const MapPage: React.FC = () => {
  return (
    <div>
      <header>
        <img src={header} alt="Header" className={styles.header} />
      </header>
    </div>
  );
};

export default MapPage;
