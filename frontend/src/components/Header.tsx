// src/components/Header.tsx
import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../auth/AuthContext";

export default function Header() {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    auth?.logout();
    navigate("/login");
  };

  return (
    <header className="flex justify-between items-center p-4 bg-gray-100 shadow">
      <nav className="space-x-4">
        <Link to="/dashboard" className="text-blue-600 hover:underline">Dashboard</Link>
        {auth?.user?.role === "admin" && (
          <Link to="/thresholds" className="text-blue-600 hover:underline">Thresholds</Link>
        )}
      </nav>
      <div>
        <span className="mr-4">Logged in as: <strong>{auth?.user?.sub}</strong></span>
        <button onClick={handleLogout} className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600">
          Logout
        </button>
      </div>
    </header>
  );
}
