import styles from "./StampList.module.css";
import type { Stamp } from "../../types/stamp";
import StampCard from "../StampCard/StampCard";
import StampUnComplete from "../../assets/stamp_points/stamp_null.png";
import { FaStamp } from "react-icons/fa";

type StampListProps = {
  stamps: Stamp[];
};
const StampList: React.FC<StampListProps> = ({ stamps }) => {
  const fixedStamps = [
    {
      stampNo: "stamp_point_1",
      stampName: "スタンプ①",
      stampSubName: "神奈川区の花",
      stampText:
        "No.22付近 GREEN×EXPO ２０２７フォトスポット",
    },
    {
      stampNo: "stamp_point_2",
      stampName: "スタンプ②",
      stampSubName: "神奈川区の木",
      stampText:
        "No.12 「総務課防災担当」",
    },
    {
      stampNo: "stamp_point_3",
      stampName: "スタンプ③",
      stampSubName: "梅雨の時期を彩る花",
      stampText:
        "本部付近 GREEN×EXPO \n ２０２７フォトスポット",
    },
    {
      stampNo: "stamp_point_4",
      stampName: "スタンプ④",
      stampSubName: "横浜市の花",
      stampText:
        "No.122 福祉保健課・生活支援課",
    },
  ];

  return (
    <div className={styles.stampListContainer}>
      <div className={styles.titleContainer}>
        <h2 className={styles.listTitle}>
          スタンプ一覧
          <span className={styles.stampIcon}>
            <FaStamp />
          </span>
        </h2>
      </div>
      <div className={styles.stampList}>
        {fixedStamps.map((fixedStamp) => {
          const foundStamp = stamps.find(
            (stamp) => stamp.stampNo === fixedStamp.stampNo
          );
          if (foundStamp) {
            return (
              <StampCard
                key={foundStamp.stampNo}
                id={foundStamp.stampNo}
                title={foundStamp.stampName}
                subTitle={foundStamp.stampSubName}
                imgPath={foundStamp.imgPath}
                stampText={foundStamp.stampText}
                isAcquired={true}
              />
            );
          } else {
            const displayImgPath = StampUnComplete;
            return (
              <StampCard
                key={fixedStamp.stampNo}
                id={fixedStamp.stampNo}
                title={fixedStamp.stampName}
                subTitle={fixedStamp.stampSubName}
                imgPath={displayImgPath}
                stampText={fixedStamp.stampText}
                isAcquired={false}
              />
            );
          }
        })}
      </div>
    </div>
  );
};

export default StampList;
