// サードパーティ
import { useNavigate } from "react-router-dom";

// 内部モジュール
import { ROUTES } from "../../constants/routes";

// アセット
import logo from "../../assets/images/logo.png";
import background from "../../assets/images/background.png";

// CSS
import styles from "./HomePage.module.css";

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const handleStartClick = () => {
    navigate(ROUTES.STAMPS);
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
