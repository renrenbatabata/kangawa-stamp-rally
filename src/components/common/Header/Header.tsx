import styles from "./Header.module.css";
import header from "./Header.png";
const Header: React.FC = () => {
  return (
    <header>
      <img src={header} alt="Header" className={styles.header} />
    </header>
  );
};

export default Header;
