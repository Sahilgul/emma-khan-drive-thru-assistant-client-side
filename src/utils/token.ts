// src/utils/token.ts

export const setSession = (token: string | null, expiresIn: number, user: any) => {
    const expiryTime = new Date().getTime() + expiresIn * 1000;
  
    localStorage.setItem("token", token || "no-token");
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("tokenExpiry", expiryTime.toString());
  };
  
  export const getUser = () => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  };
  
  export const getToken = () => localStorage.getItem("token");
  
  export const isTokenExpired = () => {
    const expiry = localStorage.getItem("tokenExpiry");
    if (!expiry) return true;
    return new Date().getTime() > parseInt(expiry);
  };
  
  export const clearSession = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("tokenExpiry");
  };
  