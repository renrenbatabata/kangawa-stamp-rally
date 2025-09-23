// src/context/UserContext.ts
import { createContext, useContext } from "react";
export const UID_LOCAL_STORAGE_KEY = "kanagawa_qr_uid";
export const UserContext = createContext<string | null>(null);
export const useUserContext = () => {
  const context = useContext(UserContext);
  if (context === null) {
    throw new Error(
      "useUserContext は UserProvider の中で使用する必要があります"
    );
  }
  return context;
};
