import { createContext, useContext, useState, useEffect } from "react";
import type { User } from "../types";
import type { ReactNode } from "react";
import {
  getToken,
  getUser,
  saveToken,
  saveUser,
  removeToken,
  removeUser,
} from "../api/auth";

type AuthMode = "user" | "guest" | null;

interface AuthContextType {
  authMode: AuthMode;
  user: User | null;
  isAuthenticated: boolean;
  isGuest: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  setAuthMode: (mode: AuthMode) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authMode, setAuthMode] = useState<AuthMode>(null);
  const [user, setUser] = useState<User | null>(null);

  // on mount check if token already exists in localStorage
  useEffect(() => {
    const token = getToken();
    const savedUser = getUser();
    if (token && savedUser) {
      setAuthMode("user");
      setUser(savedUser);
    }
  }, []);

  function login(token: string, user: User) {
    saveToken(token);
    saveUser(user);
    setUser(user);
    setAuthMode("user");
  }

  function logout() {
    removeToken();
    removeUser();
    setUser(null);
    setAuthMode(null);
  }

  return (
    <AuthContext.Provider
      value={{
        authMode,
        user,
        isAuthenticated: authMode === "user",
        isGuest: authMode === "guest",
        login,
        logout,
        setAuthMode,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
