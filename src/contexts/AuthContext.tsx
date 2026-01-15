import React, { createContext, useState, useEffect, useCallback } from "react";
import { authService } from "../services/authService";
import { showInfo, showSuccess } from "../utils/alert"; // <-- use your toast helper (e.g. showSuccess, showError, showInfo)

interface User {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  companyName: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (data: any) => Promise<void>;
  logout: (silent?: boolean) => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [lastActivity, setLastActivity] = useState<number>(Date.now());

  // === Load persisted user from localStorage ===
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch {
        localStorage.removeItem("user");
      }
    }
    setLoading(false);
  }, []);

  // === Auto-logout after 30 mins of inactivity ===
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isAuthenticated) return;
      const now = Date.now();
      if (now - lastActivity > SESSION_TIMEOUT) {
        logout(false);
        showInfo("Session expired — please sign in again.");
      }
    }, 60 * 1000); // check every 1 minute

    return () => clearInterval(interval);
  }, [isAuthenticated, lastActivity]);

  // === Reset timer when user interacts ===
  useEffect(() => {
    const updateActivity = () => setLastActivity(Date.now());
    window.addEventListener("mousemove", updateActivity);
    window.addEventListener("keydown", updateActivity);
    window.addEventListener("click", updateActivity);
    return () => {
      window.removeEventListener("mousemove", updateActivity);
      window.removeEventListener("keydown", updateActivity);
      window.removeEventListener("click", updateActivity);
    };
  }, []);

  // === Login ===
  const login = async (email: string, password: string) => {
    const res = await authService.login({ email, password });
    const loggedInUser = res.data;
    setUser(loggedInUser);
    setIsAuthenticated(true);
    localStorage.setItem("user", JSON.stringify(loggedInUser));
    localStorage.setItem("token", loggedInUser?.token || "");
    setLastActivity(Date.now());

    showSuccess(`Welcome back, ${loggedInUser.firstName}!`);
  };

  // === Signup ===
  const signup = async (data: any) => {
    await authService.signup(data);
  };

  // === Logout ===
  const logout = useCallback((silent = true) => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  
    if (!silent) {
      showInfo("You’ve been logged out successfully.");
    }
  
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
