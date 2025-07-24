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
    <nav className="navbar">
      {/* Optional left spacer for symmetry or logo */}
      <div style={{ width: "100px" }}></div>

      {/* Centered title */}
      <div className="navbar-title">Telemetry Dash</div>

      {/* Right buttons */}
      <div className="navbar-buttons">
        <Link to="/dashboard" className="nav-link">
          Dashboard
        </Link>
        {user.role === "admin" && (
          <Link to="/thresholds" className="nav-link">
            Thresholds
          </Link>
        )}
        <button
          onClick={handleLogout}
          className="btn-logout"
          type="button"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
