import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

// 必要な定数をインポート
import { UID_LOCAL_STORAGE_KEY } from "./UserContext";

// カスタムフックの定義
export const useUserRegistration = () => {
  const [uid, setUid] = useState<string>('');
  const [isFirstLogin, setIsFirstLogin] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUid = localStorage.getItem(UID_LOCAL_STORAGE_KEY);
      if (storedUid) {
        setUid(storedUid);
        setIsFirstLogin(false); // 既存ユーザー
      } else {
        const newUid = uuidv4();
        setUid(newUid);
        setIsFirstLogin(true); // 新規ユーザー
        localStorage.setItem(UID_LOCAL_STORAGE_KEY, newUid);
      }
    }
  }, []);

  useEffect(() => {
    if (isFirstLogin && uid) {
      // API呼び出し用の関数
      const registerUser = async () => {
        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
        const API_ENDPOINT = `${API_BASE_URL}/user`;

        try {
          const response = await fetch(API_ENDPOINT, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              uuid: uid,
            }),
          });

          if (!response.ok) {
            throw new Error(`ユーザー登録に失敗しました。ステータスコード: ${response.status}`);
          }
          console.log("ユーザーが正常に登録されました。");
        } catch (error) {
          console.error("ユーザー登録エラー:", error);
        }
      };
      registerUser();
    }
  }, [isFirstLogin, uid]);

  return { uid, isFirstLogin };
};