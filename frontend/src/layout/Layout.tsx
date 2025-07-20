import { Outlet, Link } from "react-router-dom";

export default function Layout() {
  return (
    <div>
      <nav className="bg-gray-800 text-white px-6 py-4 flex justify-between">
        <div className="font-bold text-lg">Telemon</div>
        <div className="space-x-4">
          <Link to="/" className="hover:underline">Dashboard</Link>
          <Link to="/thresholds" className="hover:underline">Thresholds</Link>
        </div>
      </nav>
      <main className="p-6">
        <Outlet />
      </main>
    </div>
  );
}
