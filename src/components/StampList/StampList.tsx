import styles from "./StampList.module.css";
import type { Stamp } from "../../types/stamp";
import StampCard from "../StampCard/StampCard";
import StampUnComplete from "../../assets/images/stamp_icon_unachieved.png";
import Stamptyoutitle from "../../assets/images/titlestamp.png";

type StampListProps = {
  stamps: Stamp[];
};

const StampList: React.FC<StampListProps> = ({ stamps }) => {
  // 未完了のスタンプカード表示に必要な情報
  const fixedStamps = [
    { stampNo: 1, stampName: "スタンプ1" },
    { stampNo: 2, stampName: "スタンプ2" },
    { stampNo: 3, stampName: "スタンプ3" },
    { stampNo: 4, stampName: "スタンプ4" },
  ];

  return (
    <div className={styles.stampListContainer}>
      <img src={Stamptyoutitle} className={styles.listTitle} alt="スタンプ一覧" />
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
  );
};

export default StampList;