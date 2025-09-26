import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { UID_LOCAL_STORAGE_KEY } from "./useContext";

export const useUserRegistration = () => {
  const [uid, setUid] = useState<string>("");
  const [isFirstLogin, setIsFirstLogin] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUid = localStorage.getItem(UID_LOCAL_STORAGE_KEY);
      const isInitialAccess = !storedUid;
      const currentUid = storedUid || uuidv4();
      setUid(currentUid);
      setIsFirstLogin(isInitialAccess);
      localStorage.setItem(UID_LOCAL_STORAGE_KEY, currentUid);

      const registerUser = async () => {
        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
        const API_ENDPOINT = `${API_BASE_URL}/user`;

        console.log("Registering/Confirming user with UID:", currentUid);
        setError(null);

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
            const errorBody = await response
              .json()
              .catch(() => ({ message: "No body available" }));

            const fullErrorMessage = `ユーザー登録/確認に失敗しました。ステータスコード: ${
              response.status
            }。詳細: ${JSON.stringify(errorBody)}`;
            throw new Error(fullErrorMessage);
          }
          console.log("ユーザーが正常に登録または確認されました。");
        } catch (error) {
          const errorMessage =
            error instanceof Error
              ? error.message
              : "ユーザー登録中に予期せぬエラーが発生しました。";
          console.error("ユーザー登録/確認エラー:", errorMessage, error);

          setError(errorMessage);
        }
      };
      registerUser();
    }
  }, []);

  return { uid, isFirstLogin, error };
};
