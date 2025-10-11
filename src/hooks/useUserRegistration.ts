import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { UID_LOCAL_STORAGE_KEY } from "./useContext";

const VITE_USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === "true";

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

      if (VITE_USE_MOCK_DATA) {
        setError(null);
        return;
      }

      const registerUser = async () => {
        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
        const API_ENDPOINT = `${API_BASE_URL}/user`;

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

            const fullErrorMessage = `サーバーに接続できませんでした。ステータスコード: ${
              response.status
            }。詳細: ${JSON.stringify(errorBody)}`;
            throw new Error(fullErrorMessage);
          }
        } catch (error) {
          const errorMessage =
            error instanceof Error
              ? error.message
              : "サーバーに接続できませんでした。電波の良いところで再度お試しください。";

          setError(errorMessage);
        }
      };
      registerUser();
    }
  }, []);

  return { uid, isFirstLogin, error };
};
