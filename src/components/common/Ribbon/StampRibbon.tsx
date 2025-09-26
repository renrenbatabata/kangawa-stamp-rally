// src/components/StampRibbon/StampRibbon.js

import React from "react";
import styles from "./StampRibbon.module.css"; // CSSモジュールをインポート

/**
 * かわいいスタンプ帳リボンコンポーネント
 * @param {object} props
 * @param {string} props.text - リボンに表示するテキスト
 * @param {string} [props.color='--ribbon-color'] - メインリボンの色を示すCSS変数名
 */
type StampRibbonProps = {
  text: string;
  color?: string;
};

const StampRibbon: React.FC<StampRibbonProps> = ({ text, color = "var(--ribbon-color)" }) => {
  // スタイルをインラインで設定し、CSS変数を上書きできるようにします
  const customStyles = {
    ["--ribbon-color" as string]: color,
  } as React.CSSProperties;

  return (
    <div className={styles.ribbon} style={customStyles}>
      {text}
    </div>
  );
};

export default StampRibbon;
