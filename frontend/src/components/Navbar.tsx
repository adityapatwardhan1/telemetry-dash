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



// import { useContext } from "react";
// import { AuthContext } from "../auth/AuthContext";
// import { Link, useNavigate } from "react-router-dom";

// export default function Navbar() {
//   const auth = useContext(AuthContext);
//   if (!auth) throw new Error("AuthContext not found");

//   const { user } = auth;
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     auth.logout();
//     navigate("/login");
//   };

//   if (!user) return null;

//   return (
//     <nav className="fixed top-0 left-0 right-0 bg-gray-900 text-white px-6 py-4 shadow-md z-50 flex items-center">
//       {/* Title centered */}
//       <div className="flex-grow text-center text-lg font-semibold tracking-wide">
//         Telemetry Dash
//       </div>

//       {/* Right buttons */}
//       <div className="flex gap-6 text-sm">
//         <Link to="/dashboard" className="hover:underline">
//           Dashboard
//         </Link>
//         {user.role === "admin" && (
//           <Link to="/thresholds" className="hover:underline">
//             Thresholds
//           </Link>
//         )}
//         <button
//           onClick={handleLogout}
//           className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
//         >
//           Logout
//         </button>
//       </div>
//     </nav>
//   );
// }



// import { useContext } from "react";
// import { AuthContext } from "../auth/AuthContext";
// import { Link, useNavigate } from "react-router-dom";

// export default function Navbar() {
//   const auth = useContext(AuthContext);
//   if (!auth) throw new Error("AuthContext not found");

//   const { user } = auth;
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     auth.logout();
//     navigate("/login");
//   };

//   if (!user) return null;

//   return (
//     <nav className="fixed top-0 left-0 right-0 bg-gray-900 text-white px-6 py-4 shadow-md z-50 flex items-center justify-between">
//       {/* Left Spacer for balance */}
//       <div className="w-1/3" />

//       {/* Centered Title */}
//       <div className="w-1/3 text-center text-lg font-semibold tracking-wide">
//         Telemetry Dash
//       </div>

//       {/* Right Buttons */}
//       <div className="w-1/3 flex justify-end gap-6 text-sm">
//         <Link to="/dashboard" className="hover:underline">
//           Dashboard
//         </Link>
//         {user.role === "admin" && (
//           <Link to="/thresholds" className="hover:underline">
//             Thresholds
//           </Link>
//         )}
//         <button
//           onClick={handleLogout}
//           className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
//         >
//           Logout
//         </button>
//       </div>
//     </nav>
//   );
// }



// // components/Navbar.tsx
// import { useContext } from "react";
// import { AuthContext } from "../auth/AuthContext";
// import { Link, useNavigate } from "react-router-dom";

// export default function Navbar() {
//   const auth = useContext(AuthContext);
//   if (!auth) throw new Error("AuthContext not found");
  
//   const { user } = auth;
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     auth.logout();
//     navigate("/login");
//   };

//   if (!user) return null;

//   return (
//     <nav className="fixed top-0 left-0 right-0 bg-gray-800 text-white p-4 shadow-md z-50 flex justify-between items-center">
//       <div className="flex gap-4">
//         <Link to="/dashboard" className="hover:underline">
//           Dashboard
//         </Link>
//         {user.role === "admin" && (
//           <Link to="/thresholds" className="hover:underline">
//             Thresholds
//           </Link>
//         )}
//       </div>
//       <button
//         onClick={handleLogout}
//         className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
//       >
//         Logout
//       </button>
//     </nav>
//   );
// }
