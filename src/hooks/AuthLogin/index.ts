"use client";

import { useDispatchAuthLogin } from "./StoreProvider";
import { TypesAuthLogin } from "./authLoginTypes";
import { postAll, getAll } from "@/src/utils/methods";
import {
  setAuthorizationToken,
  getStoredToken,
  clearAuthToken,
} from "@/src/utils/setAuthorizationToken";

const AUTH_TOKEN_KEY = "authtokenclient";

function decodeJwtPayload(token: string) {
  try {
    const base64 = token.split(".")[1]?.replace(/-/g, "+").replace(/_/g, "/");
    if (!base64) return null;
    return JSON.parse(atob(base64));
  } catch {
    return null;
  }
}

export interface ILoginPayload {
  email: string;
  password: string;
}

async function fetchUserInfo(token?: string) {
  const t = token ?? getStoredToken();
  if (!t) return null;

  setAuthorizationToken(t);

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
  const url = `${baseUrl}/info-users`;

  try {
    return await getAll(url);
  } catch {
    return null;
  }
}

export function useAuthLogin() {
  const dispatch = useDispatchAuthLogin();

  return {
    async postAuthLogin(data: ILoginPayload) {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
      const url = `${baseUrl}/login`;

      try {
        const res: any = await postAll(url, data);
        const body = res?.data ?? res;
        const token = typeof body === "string" ? body : body?.token ?? body;

        if (!token || typeof token !== "string") {
          return { code: 400, message: "No se recibió token", name: "Error" };
        }

        localStorage.setItem(AUTH_TOKEN_KEY, token);
        setAuthorizationToken(token);

        let user = await fetchUserInfo(token);
        if (!user && token.includes(".")) {
          user = decodeJwtPayload(token);
        }
        dispatch({
          type: TypesAuthLogin.POST_AUTHLOGIN,
          payload: { token, user },
        });

        return { token, user };
      } catch (e: any) {
        return {
          code: 400,
          message: e?.response?.data?.message ?? "Usuario o contraseña incorrecta",
          name: "NotFound",
        };
      }
    },

    fetchUserInfo,

    async loadUserFromStorage() {
      const token = getStoredToken();
      if (!token) return;

      setAuthorizationToken(token);
      let user = await fetchUserInfo(token);
      if (!user && token.includes(".")) {
        user = decodeJwtPayload(token);
      }
      dispatch({
        type: TypesAuthLogin.SET_USER,
        payload: { user },
      });
    },

    logout() {
      clearAuthToken();
      dispatch({ type: TypesAuthLogin.LOGOUT });
    },
  };
}
