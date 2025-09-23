import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./ScanResultSuccessPage.module.css";
import background from "../../assets/images/background.png";
import { UID_LOCAL_STORAGE_KEY } from "../../hooks/useContext";

// スタンプ画像のパスを定義
import Stamp01 from "../../assets/stamp_points/stamp_point_1.png";
import Stamp02 from "../../assets/stamp_points/stamp_point_2.png";
import Stamp03 from "../../assets/stamp_points/stamp_point_3.png";
import Stamp04 from "../../assets/stamp_points/stamp_point_4.png";
import Stamp05 from "../../assets/stamp_points/stamp_point_5.png";
import Stamp06 from "../../assets/stamp_points/stamp_point_6.png";

const ScanResultSuccessPage: React.FC = () => {
  const navigate = useNavigate();
  const [stampImagePath, setStampImagePath] = useState<string | null>(null);

  useEffect(() => {
    const addNewStamp = async () => {
      const existingUuid = localStorage.getItem(UID_LOCAL_STORAGE_KEY);
      if (!existingUuid) {
        console.error("UUIDがLocalStorageに見つかりませんでした。");
        return;
      }

      const stampId = "stamp001"; // todo 適切な値にする

      try {
        const response = await fetch("/add", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            uuid: existingUuid,
            stampId: stampId,
          }),
        });

        if (!response.ok) {
          throw new Error("スタンプ登録APIの呼び出しに失敗しました。");
        }
        const data = await response.json();
        console.log("スタンプ登録成功:", data);
        setStampImagePath(data.imgPath);

      } catch (error) {
        console.error("スタンプ登録処理でエラーが発生しました:", error);
      }
    };

    addNewStamp();
  }, []);

  const handleCloseClick = () => {
    navigate("/stamps");
  };

  const stamps = [Stamp01, Stamp02, Stamp03, Stamp04, Stamp05, Stamp06];
  const displayedStampPath = stampImagePath || stamps[Math.floor(Math.random() * stamps.length)];

  return (
    <div
      className={styles.successPage}
      style={{ backgroundImage: `url(${background})` }}
    >
      <div className={styles.cardContainer}>
        <h1 className={styles.title}>スタンプゲット!!</h1>
        <img
          src={displayedStampPath}
          alt="スタンプゲット成功！"
          className={styles.stampImage}
        />
        <button type="button" className={styles.closeButton} onClick={handleCloseClick}>
          <span className={styles.closeIcon}>✕</span>
        </button>
      </div>
    </div>
  );
};

export default ScanResultSuccessPage;