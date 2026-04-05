import React, { createContext, useContext, useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";

type AuthContextType = {
  isAuthenticated: boolean;
  setIsAuthenticated: (auth: boolean) => void;
  isLoading: boolean;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const logout = async () => {
    await SecureStore.deleteItemAsync("jwt");
    setIsAuthenticated(false);
  };

  useEffect(() => {
    async function checkAuth() {
      setIsLoading(true);
      const token = await SecureStore.getItemAsync("jwt");
      setIsAuthenticated(!!token);
      setIsLoading(false);
    }
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, isLoading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
