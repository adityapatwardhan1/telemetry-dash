// import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// import Login from "./pages/Login";
// import Dashboard from "./pages/Dashboard";
// import { AuthProvider } from "./auth/AuthContext";


// export default function App() {
//   return (
//     <AuthProvider>
//       <BrowserRouter>
//         <Routes>
//           <Route path="/login" element={<Login />} />
//           <Route path="/dashboard" element={<Dashboard />} />
//           <Route path="/" element={<Navigate to="/login" replace />} />
//           <Route path="*" element={<div>404 Not Found</div>} />
//         </Routes>
//       </BrowserRouter>
//     </AuthProvider>
//   );
// }

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Thresholds from "./pages/Thresholds";
import { AuthProvider, AuthContext } from "./auth/AuthContext";
import { useContext } from "react";
import './App.css'
import './index.css';


function RequireAdmin({ children }: { children: React.ReactNode }) {
  const auth = useContext(AuthContext);

  if (!auth) {
    // AuthContext not provided (shouldn't happen if wrapped properly)
    return <Navigate to="/login" replace />;
  }

  const { user } = auth;

  if (!user) {
    // Not logged in
    return <Navigate to="/login" replace />;
  }

  if (!user.isAdmin) {
    // Logged in but not admin
    return <div>Access denied: Admins only</div>;
  }

  return <>{children}</>;
}


export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route
            path="/thresholds"
            element={
              <RequireAdmin>
                <Thresholds />
              </RequireAdmin>
            }
          />
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<div>404 Not Found</div>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
