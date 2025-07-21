import React, { createContext, useContext, useState } from "react";

type AuthContextType = {
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem("token") || import.meta.env.VITE_DEFAULT_TOKEN || null
  );
  console.log("Loaded token:", token);

  // const [token, setToken] = useState<string | null>(() => localStorage.getItem("token"));

  const login = (newToken: string) => {
    setToken(newToken);
    localStorage.setItem("token", newToken);   // <-- add this
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem("token");          // <-- and this
  };


  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};

