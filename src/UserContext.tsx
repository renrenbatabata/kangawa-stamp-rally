// src/context/UserContext.ts
import { createContext, useContext } from "react"; // ReactのContext関連フックをインポート

// UIDをlocalStorageに保存するためのキーをエクスポート
export const UID_LOCAL_STORAGE_KEY = "kanagawa_qr_uid"; // 他のアプリと衝突しないユニークなキー名を推奨

// UserContextの定義とエクスポート
// コンテキストの初期値はnull。Providerがない場合はnullが返ることを示す。
export const UserContext = createContext<string | null>(null);

// UserContextを利用するためのカスタムフック
// このフックもエクスポートします
export const useUserContext = () => {
  const context = useContext(UserContext);
  // ContextがUserProviderで提供されていない場所でフックが使われた場合にエラーをスロー
  if (context === null) {
    throw new Error(
      "useUserContext は UserProvider の中で使用する必要があります"
    );
  }
  return context;
};
