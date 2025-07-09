import { useNavigate } from "react-router-dom";
import stylse from "./HomePage.module.css";

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
      className={stylse.homePage}
      style={{ backgroundImage: `url(${background})` }}
    >
      <div className={stylse.overlay}>
        <img src={logo} alt="Logo" className={stylse.logo} />
        <button className={stylse.startButton} onClick={handleStartClick}>
          はじめる
        </button>
      </div>
    </div>
  );
};

export default HomePage;
