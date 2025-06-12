import { useState, type ReactNode } from "react";

import { STORAGE_KEYS } from "src/constant";
import { AuthContext, type AuthContextType } from "src/hooks/useAuth";
import type { User } from "src/types";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const login = (userData: User) => {
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem(STORAGE_KEYS.AUTH, "true");
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem(STORAGE_KEYS.AUTH);
    localStorage.removeItem(STORAGE_KEYS.USER);
  };

  const loadAuthState = () => {
    const savedAuth = localStorage.getItem(STORAGE_KEYS.AUTH);
    const savedUser = localStorage.getItem(STORAGE_KEYS.USER);

    // Only set authenticated if BOTH auth flag and user data exist and are valid
    if (savedAuth === "true" && savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Error parsing saved user data:", error);
        // If user data is corrupted, clear everything and force re-login
        localStorage.removeItem(STORAGE_KEYS.AUTH);
        localStorage.removeItem(STORAGE_KEYS.USER);
        setIsAuthenticated(false);
        setUser(null);
      }
    } else {
      // If either auth flag or user data is missing, clear everything
      localStorage.removeItem(STORAGE_KEYS.AUTH);
      localStorage.removeItem(STORAGE_KEYS.USER);
      setIsAuthenticated(false);
      setUser(null);
    }
  };

  const value: AuthContextType = {
    isAuthenticated,
    user,
    login,
    logout,
    loadAuthState,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
