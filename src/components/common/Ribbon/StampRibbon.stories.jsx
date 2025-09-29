// src/stories/StampRibbon.stories.js

import React from "react";
import StampRibbon from "./StampRibbon";

// Storybookでのコンポーネネントのメタデータ設定
export default {
  title: "Design/StampRibbon", // Storybookのサイドバーでの表示名
  component: StampRibbon,
  // propsを操作するためのArgsTypesを設定
  argTypes: {
    color: { control: "color" }, // カラーピッカーで色を操作できるようにします
  },
};

// テンプレートを作成
const Template = (args) => <StampRibbon {...args} />;

// 🔴 1. 太陽みたいなオレンジリボン ☀️
export const OrangeRibbon = Template.bind({});
OrangeRibbon.args = {
  color: "#ff9933", // デフォルトのオレンジ
};

// 🟢 2. 若葉みたいなグリーンリボン 🌿
export const GreenRibbon = Template.bind({});
GreenRibbon.args = {
  color: "#66cc99", // 別の色
};

// 🔵 3. 広がる空みたいなブルーリボン ☁️
export const BlueRibbon = Template.bind({});
BlueRibbon.args = {
  color: "#4a90e2", // 別の色
};
