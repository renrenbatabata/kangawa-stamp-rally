import styles from "./StampList.module.css";
import type { Stamp } from "../../types/stamp";
import StampCard from "../StampCard/StampCard";
import StampUnComplete from "../../assets/stamp_points/stanm_null.png";
import { FaStamp } from "react-icons/fa";

type StampListProps = {
  stamps: Stamp[];
};

const StampList: React.FC<StampListProps> = ({ stamps }) => {
  const fixedStamps = [
    {
      stampNo: "stamp_point_1",
      stampName: "チューリップ",
      stampText:
        "反町公園：色とりどりのチューリップが咲き誇り、うららかな春の訪れを教えてくれる。",
    },
    {
      stampNo: "stamp_point_2",
      stampName: "こぶし",
      stampText:
        "片倉うさぎ山公園：春の兆しを感じるころ、走り回る子どもたちを満開のこぶしが見守ります。",
    },
    {
      stampNo: "stamp_point_3",
      stampName: "アジサイ",
      stampText:
        "三ツ沢せせらぎ緑道：静けさに響くせせらぎとアジサイが奏でるハーモニー。",
    },
    {
      stampNo: "stamp_point_4",
      stampName: "バラ",
      stampText:
        "三ツ沢公園：バラ園には季節ごとに様々な種類のバラが咲き、華やかな香り、色を楽しめます。",
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
                imgPath={foundStamp.imgPath}
                stampText={foundStamp.stampText}
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
                stampText={fixedStamp.stampText}
              />
            );
          }
        })}
      </div>
    </div>
  );
};

export default StampList;
