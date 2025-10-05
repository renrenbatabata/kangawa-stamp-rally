// ウォークスルーを表示するためのカスタムイベント
export const showWalkthroughEvent = () => {
  window.dispatchEvent(new CustomEvent('showWalkthrough'));
};

export const WALKTHROUGH_KEY = "kanagawa_stamp_rally_walkthrough_completed";

