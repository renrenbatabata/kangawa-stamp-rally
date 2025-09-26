// src/stories/StampRibbon.stories.js

import React from 'react';
import StampRibbon from './StampRibbon';

// Storybookでのコンポーネネントのメタデータ設定
export default {
    title: 'Design/StampRibbon', // Storybookのサイドバーでの表示名
    component: StampRibbon,
    // propsを操作するためのArgsTypesを設定
    argTypes: {
        text: { control: 'text' },
        color: { control: 'color' }, // カラーピッカーで色を操作できるようにします
    },
};

// テンプレートを作成
const Template = (args) => <StampRibbon {...args} />;

// 🔴 1. デフォルトのストーリー（スタンプ帳）
export const DefaultRibbon = Template.bind({});
DefaultRibbon.args = {
    text: 'スタンプ帳',
    color: '#ff9933', // デフォルトのオレンジ
};

// 🟢 2. 色を変えたバリエーション（緑のリボン）
export const GreenRibbon = Template.bind({});
GreenRibbon.args = {
    text: '特別記念',
    color: '#66cc99', // 別の色
};

// 🔵 3. 長いテキストのテスト
export const LongTextRibbon = Template.bind({});
LongTextRibbon.args = {
    text: '限定プレミアム特典リボン',
    color: '#4a90e2', // 別の色
};