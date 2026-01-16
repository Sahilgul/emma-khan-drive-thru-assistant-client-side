import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE_URL;
export const authService = {
  signup: (data: any) => axios.post(`${API_BASE}/auth/signup`, data),
  verifyPasscode: (passcode: string) => axios.post(`${API_BASE}/auth/verify-passcode`, { passcode }),
  login: (data: any) => axios.post(`${API_BASE}/auth/login`, data),
  forgotPassword: (data: any) => axios.post(`${API_BASE}/auth/forgot-password`, data),
  resetPassword: (data: any) => axios.post(`${API_BASE}/auth/reset-password`, data),
};