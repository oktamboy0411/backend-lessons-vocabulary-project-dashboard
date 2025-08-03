import { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router";
import { API_URL } from "~/config";

const navLinks = [
  { path: "/", label: "Home" },
  { path: "/vocabulary", label: "Vocabulary" },
  { path: "/section", label: "Sections" },
  { path: "/category", label: "Categories" },
  { path: "/word", label: "Words" },
];

interface AdminProfile {
  _id: string;
  name: string;
  phone: string;
  role: string;
  created_at: string;
  updated_at: string;
}

function Navbar() {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState<AdminProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdmin = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const res = await fetch(`${API_URL}/admin/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const json = await res.json();

        if (json.success && json.data?.role === "admin") {
          setAdmin(json.data);
        } else {
          navigate("/login");
        }
      } catch {
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    checkAdmin();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg text-gray-600">Loading admin panel...</p>
      </div>
    );
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="flex h-screen max-w-[1800px] mx-auto">
      {/* Sidebar */}
      <nav className="w-64 bg-white shadow-md p-6 flex flex-col justify-between border-r">
        <div>
          <h2 className="text-2xl font-bold mb-2">Dashboard</h2>
          {admin && (
            <div className="text-sm text-gray-600 mb-4">
              <p className="font-semibold">{admin.name}</p>
              <p className="text-xs">{admin.phone}</p>
            </div>
          )}
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
        </div>
        <button
          onClick={handleLogout}
          className="w-full mt-4 text-left px-4 py-2 rounded-md text-lg font-medium text-red-600 hover:bg-red-100 transition"
        >
          Logout
        </button>
      </nav>

      {/* Main content */}
      <main className="flex-1 p-6 bg-gray-50 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}

export default Navbar;
