"use client";

import { createContext, useContext, useReducer } from "react";
import AuthLoginTypes, { TypesAuthLogin } from "./authLoginTypes";

const StoreContextAuthLogin = createContext<any | null>(null);

const initialState: { user: any; token: string | null } = {
  user: null,
  token: null,
};

export default function StoreProviderAuthLogin({ children }: { children: React.ReactNode }) {
  const [store, dispatch] = useReducer(AuthLoginTypes, initialState);

  return (
    <StoreContextAuthLogin.Provider value={[store, dispatch]}>
      {children}
    </StoreContextAuthLogin.Provider>
  );
}

const useStoreAuthLogin = () => useContext(StoreContextAuthLogin)[0];
const useDispatchAuthLogin = () => useContext(StoreContextAuthLogin)[1];

export { StoreContextAuthLogin, useStoreAuthLogin, useDispatchAuthLogin, TypesAuthLogin };
