const TypesAuthLogin = {
  POST_AUTHLOGIN: "POST_AUTHLOGIN",
  GET_AUTHLOGIN: "GET_AUTHLOGIN",
  SET_USER: "SET_USER",
  LOGOUT: "LOGOUT",
};

export interface AuthUser {
  id?: number;
  name?: string;
  email?: string;
  type?: string;
  [key: string]: unknown;
}

function AuthLoginTypes(state: any, action: any) {
  const { type, payload } = action;
  switch (type) {
    case TypesAuthLogin.POST_AUTHLOGIN:
      return { ...state, token: payload.token, user: payload.user ?? state.user };
    case TypesAuthLogin.GET_AUTHLOGIN:
      return { ...state, user: payload.user ?? null };
    case TypesAuthLogin.SET_USER:
      return { ...state, user: payload.user ?? null };
    case TypesAuthLogin.LOGOUT:
      return { ...state, user: null, token: null };
    default:
      return state;
  }
}

export { TypesAuthLogin };
export default AuthLoginTypes;
