// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import './index.css'
// import App from './App.tsx'

// createRoot(document.getElementById('root')!).render(
//   <StrictMode>
//     <App />
//   </StrictMode>,
// )

// import React, { useState } from "react";
// import ReactDOM from "react-dom/client";
// import App from "./App";
// import { AuthContext } from "./auth/AuthContext"

// const Root = () => {
//   const [token, setToken] = useState<string | null>(null);

//   return (
//     <AuthContext.Provider value={{ token, setToken }}>
//       <App />
//     </AuthContext.Provider>
//   );
// };

// ReactDOM.createRoot(document.getElementById("root")!).render(<Root />);


import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthContext } from "./auth/AuthContext";

const Root = () => {
  const [token, setToken] = useState<string | null>(null);

  const login = (newToken: string) => {
    setToken(newToken);
    localStorage.setItem("token", newToken);
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      <App />
    </AuthContext.Provider>
  );
};

ReactDOM.createRoot(document.getElementById("root")!).render(<Root />);
