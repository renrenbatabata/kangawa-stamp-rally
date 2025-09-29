// src/components/StampRibbon/StampRibbon.js

import React from "react";
import styles from "./StampRibbon.module.css"; // CSSモジュールをインポート

/**
 * かわいいスタンプ帳リボンコンポーネント
 * @param {object} props
 * @param {string} [props.color='--ribbon-color'] - メインリボンの色を示すCSS変数名
 */
type StampRibbonProps = {
  color?: string;
};

const StampRibbon: React.FC<StampRibbonProps> = ({
  color = "var(--ribbon-color)",
}) => {
  // スタイルをインラインで設定し、CSS変数を上書きできるようにします
  const customStyles = {
    ["--ribbon-color" as string]: color,
  } as React.CSSProperties;

  return (
    <div className={styles.ribbon} style={customStyles}>
      スタンプ帳
    </div>
  );
};

export default StampRibbon;
