import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { UID_LOCAL_STORAGE_KEY } from "./useContext";

export const useUserRegistration = () => {
  const [uid, setUid] = useState<string>('');
  const [isFirstLogin, setIsFirstLogin] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUid = localStorage.getItem(UID_LOCAL_STORAGE_KEY);

      // 初回アクセスかどうかを判定
      const isInitialAccess = !storedUid;

      // ユーザーIDを設定
      const currentUid = storedUid || uuidv4();
      setUid(currentUid);
      setIsFirstLogin(isInitialAccess);
      localStorage.setItem(UID_LOCAL_STORAGE_KEY, currentUid);

      // 初回アクセスの場合にのみAPIを呼び出す
      if (isInitialAccess) {
        const registerUser = async () => {
          const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
          const API_ENDPOINT = `${API_BASE_URL}/user`;

          console.log("Registering user with UID:", currentUid);
          console.log(API_BASE_URL, API_ENDPOINT);

          try {
            const response = await fetch(API_ENDPOINT, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                uuid: currentUid,
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
    }
  }, []); 

  return { uid, isFirstLogin };
};