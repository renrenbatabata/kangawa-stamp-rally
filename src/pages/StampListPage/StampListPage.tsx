import { useState, useEffect } from "react";
import { useUserContext } from "../../UserContext";
import styles from "./StampListPage.module.css";
import type { Stamp } from "../../types/stamp";
import StampUnComplete from "../../assets/images/stamp_icon_unachieved.png";

// 共通コンポーネント
import Header from "../../components/common/Header/Header";
import StampCard from "../../components/StampCard/StampCard";
import FooterNav from "../../components/common/FooterNav/FooterNav";
import StampBadge from "../../components/common/StampBadge/StampBadge";
import QRtitle from "../../assets/images/QRtitle.png";
import Stamptyoutitle from "../../assets/images/titlestamp.png";

const StampListPage: React.FC = () => {
  const uid = useUserContext();
  console.log("User UID:", uid);

  const [stamps, setStamps] = useState<Stamp[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // 未完了のスタンプカード表示に必要な情報
  const fixedStamps = [
    { stampNo: 1, stampName: "スタンプ1" },
    { stampNo: 2, stampName: "スタンプ2" },
    { stampNo: 3, stampName: "スタンプ3" },
    { stampNo: 4, stampName: "スタンプ4" },
  ];

  useEffect(() => {
    const fetchStamps = async () => {
      // UIDはここでは使用しない
      // if (!uid) { ... }

      try {
        // ローカルのJSONファイルを読み込む
        const response = await fetch("/data/stamps.json");
        if (!response.ok) {
          throw new Error("Failed to fetch mock data.");
        }
        const data = await response.json();
        setStamps(data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(`Data Fetch Error: ${err.message}`);
        } else {
          setError("An unknown error occurred.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchStamps();
  }, []);

  // useEffect(() => {
  //   const fetchStamps = async () => {
  //     // UIDがなければ処理を中止し、エラーを設定
  //     if (!uid) {
  //       setError("User UID is not available.");
  //       setIsLoading(false);
  //       return;
  //     }

  //     try {
  //       const response = await fetch(`http://localhost:8080/api/top?uuid=${uid}`);
  //       if (!response.ok) {
  //         throw new Error("Failed to fetch stamp data.");
  //       }
  //       const data: Stamp[] = await response.json();
  //       setStamps(data);
  //     } catch (err: unknown) {
  //       if (err instanceof Error) {
  //         setError(`API Error: ${err.message}`);
  //       } else {
  //         setError("An unknown error occurred.");
  //       }
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  //   fetchStamps();
  // }, [uid]);

  // スタンプの進捗を計算
  const progress = stamps.length;

  // ローディング中の表示
  if (isLoading) {
    return (
      <div className={styles.container}>
        <Header />
        <div className={styles.messageContainer}>
          <p>読み込み中...</p>
        </div>
        <FooterNav />
      </div>
    );
  }

  // エラー発生時の表示
  if (error) {
    return (
      <div className={styles.container}>
        <Header />
        <div className={styles.messageContainer}>
          <p>{error}</p>
        </div>
        <FooterNav />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Header />

      <img src={QRtitle} className={styles.qrTitleImage} />

      <div className={styles.progressContainer}>
        <StampBadge progress={progress} />
      </div>

      <div className={styles.stampListContainer}>
        <img src={Stamptyoutitle} className={styles.listTitle} />
        <div className={styles.stampList}>
          {fixedStamps.map((fixedStamp) => {
            const foundStamp = stamps.find((stamp) => stamp.stampNo === fixedStamp.stampNo);
            if (foundStamp) {
              return (
                <StampCard
                  key={foundStamp.stampNo}
                  id={foundStamp.stampNo}
                  title={foundStamp.stampName}
                  imgPath={foundStamp.imgPath}
                />
              );
            } else {
              const displayImgPath = StampUnComplete; 
              return (
                <StampCard
                  key={fixedStamp.stampNo}
                  id={fixedStamp.stampNo}
                  title={fixedStamp.stampName}
                  imgPath={displayImgPath}
                />
              );
            }
          })}
        </div>
      </div>

      <FooterNav />
    </div>
  );
};

export default StampListPage;