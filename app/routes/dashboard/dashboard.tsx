import { NavLink, Outlet } from "react-router";

const navLinks = [
  { path: "/", label: "Home" },
  { path: "/vocabulary", label: "Vocabulary" },
  { path: "/categories", label: "Categories" },
  { path: "/settings", label: "Settings" },
];

function Navbar() {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <nav className="w-64 bg-white shadow-md p-6 space-y-4 border-r">
        <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
        <ul className="space-y-2">
          {navLinks.map(({ path, label }) => (
            <li key={path}>
              <NavLink
                to={path}
                className={({ isActive }) =>
                  `block px-4 py-2 rounded-md text-lg font-medium ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`
                }
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Main content */}
      <main className="flex-1 p-6 bg-gray-50">
        <Outlet />
      </main>
    </div>
  );
}

export default Navbar;
