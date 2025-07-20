// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Login from "./pages/Login";
// import Dashboard from "./pages/Dashboard";
// import ThresholdsPage from "./pages/Thresholds";
// import Layout from "./layout/Layout";
// import { AuthProvider } from "./auth/AuthContext";

// export default function App() {
//   return (
//     <AuthProvider>
//       <BrowserRouter>
//         <Routes>
//           <Route path="/login" element={<Login />} />
//           <Route element={<Layout />}>
//             <Route path="/" element={<Dashboard />} />
//             <Route path="/thresholds" element={<ThresholdsPage />} />
//             {/* <Route path="/thresholds" element={<Thresholds />} /> */}
//           </Route>
//         </Routes>
//       </BrowserRouter>
//     </AuthProvider>
//   );
// }

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import { AuthProvider } from "./auth/AuthContext";
import './App.css'
import './index.css';  // <-- Make sure this import is present
export default function App() {
  return (
    <AuthProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        {/* Optional: redirect root to login or dashboard */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        {/* Catch-all 404 route */}
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </BrowserRouter>
    </AuthProvider>
  );
}

