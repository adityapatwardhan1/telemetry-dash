// components/Navbar.tsx
import { useContext } from "react";
import { AuthContext } from "../auth/AuthContext";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const auth = useContext(AuthContext);
  if (!auth) throw new Error("AuthContext not found");
  
  const { user } = auth;
  const navigate = useNavigate();

  const handleLogout = () => {
    auth.logout();
    navigate("/login");
  };

  if (!user) return null;

  return (
    <nav className="fixed top-0 left-0 right-0 bg-gray-800 text-white p-4 shadow-md z-50 flex justify-between items-center">
      <div className="flex gap-4">
        <Link to="/dashboard" className="hover:underline">
          Dashboard
        </Link>
        {user.role === "admin" && (
          <Link to="/thresholds" className="hover:underline">
            Thresholds
          </Link>
        )}
      </div>
      <button
        onClick={handleLogout}
        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
      >
        Logout
      </button>
    </nav>
  );
}
