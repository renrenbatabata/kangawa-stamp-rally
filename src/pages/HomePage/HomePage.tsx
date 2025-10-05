import { useNavigate } from "react-router-dom";
import styles from "./HomePage.module.css";

//画像インポート
import logo from "../../assets/images/logo.png";
import background from "../../assets/images/background.png";

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const handleStartClick = () => {
    navigate("/stamps");
  };

  return (
    <div
      className={styles.homePage}
      style={{ backgroundImage: `url(${background})` }}
    >
      <div className={styles.overlay}>
        <img src={logo} alt="Logo" className={styles.logo} />
        <button type="button" className={styles.startButton} onClick={handleStartClick}>
          はじめる
        </button>
      </div>
    </div>
  );
};

export default HomePage;
