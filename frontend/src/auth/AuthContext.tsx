// import React, { createContext, useContext, useState } from "react";

// // type AuthContextType = {
// //   token: string | null;
// //   login: (token: string) => void;
// //   logout: () => void;
// // };

// type User = {
//   id: number;
//   username: string;
//   isAdmin: boolean;
// };

// type AuthContextType = {
//   token: string | null;
//   user: User | null;
//   login: (token: string, user: User) => void;
//   logout: () => void;
// };

// export const AuthContext = createContext<AuthContextType | null>(null);

// export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
//   const [token, setToken] = useState<string | null>(() =>
//     localStorage.getItem("token") || import.meta.env.VITE_DEFAULT_TOKEN || null
//   );
//   console.log("Loaded token:", token);

//   const [user, setUser] = useState<User | null>(null);

//   // const [token, setToken] = useState<string | null>(() => localStorage.getItem("token"));


//   // return (
//   //   <AuthContext.Provider value={{ token, login, logout }}>
//   //     {children}
//   //   </AuthContext.Provider>
//   // );
//   const login = (token: string, userData: User) => {
//     setToken(token);
//     setUser(userData);
//   };

//   const logout = () => {
//     setToken(null);
//     setUser(null);
//   };

//   // Provide user and token in context value:
//   <AuthContext.Provider value={{ token, user, login, logout }}>
//     {children}
//   </AuthContext.Provider>
// };

// export const useAuth = () => {
//   const ctx = useContext(AuthContext);
//   if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
//   return ctx;
// };


import React, { createContext, useContext, useState } from "react";

type User = {
  id: number;
  username: string;
  isAdmin: boolean;
};

type AuthContextType = {
  token: string | null;
  user: User | null;
  login: (token: string, user: User) => void;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem("token") || import.meta.env.VITE_DEFAULT_TOKEN || null
  );
  const [user, setUser] = useState<User | null>(null);

  const login = (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem("token", newToken);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
