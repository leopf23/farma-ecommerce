import axios from "axios";

const AUTH_TOKEN_KEY = "authtokenclient";

/**
 * Configura el token en axios para que todas las peticiones lo lleven automáticamente.
 * No hace falta pasar el token manualmente en cada llamada.
 */
export function setAuthorizationToken(token: string | null) {
  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    (axios.defaults.headers.common as Record<string, string>)["authtokenclient"] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common["Authorization"];
    delete (axios.defaults.headers.common as Record<string, unknown>)["authtokenclient"];
  }
}

export function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

export function clearAuthToken() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(AUTH_TOKEN_KEY);
  setAuthorizationToken(null);
}
