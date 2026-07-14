import {
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  LayoutGrid,
  Users,
  CalendarDays,
  Settings,
  Bell,
  Search,
  LogOut,
  UserCircle2,
  Stethoscope,
  ShieldCheck,
  BarChart3,
} from "lucide-react";
import NotificationCenter from "../components/NotificationCenter";

import { motion } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";

const links = [
  {
    to: "/admin",
    label: "Dashboard",
    icon: LayoutGrid,
  },
  {
    to: "/admin/doctors",
    label: "Doctors",
    icon: Stethoscope,
  },
  {
    to: "/admin/patients",
    label: "Patients",
    icon: Users,
  },
  {
    to: "/admin/appointments",
    label: "Appointments",
    icon: CalendarDays,
  },
  {
    to: "/admin/analytics",
    label: "Analytics",
    icon: BarChart3,
  },
  {
    to: "/admin/settings",
    label: "Settings",
    icon: Settings,
  },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      <div className="mx-auto flex max-w-screen-2xl">

        {/* Sidebar */}

        <aside className="hidden lg:flex w-72 flex-col border-r border-white/10 bg-white/5 backdrop-blur-xl">

          <div className="p-6">

            <div className="flex items-center gap-3">

              <div className="rounded-2xl bg-amber-500/20 p-3 text-amber-300">
                <ShieldCheck size={26} />
              </div>

              <div>

                <h1 className="text-xl font-bold">
                  CareFlow
                </h1>

                <p className="text-sm text-slate-400">
                  Admin Portal
                </p>

              </div>

            </div>

          </div>

          <nav className="flex-1 px-4 space-y-2">

            {links.map(({ to, label, icon: Icon }) => (

              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-200
                  ${
                    isActive
                      ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg"
                      : "text-slate-300 hover:bg-white/10"
                  }`
                }
              >
                <Icon size={19} />
                {label}
              </NavLink>

            ))}

          </nav>

          <div className="border-t border-white/10 p-5">

            <div className="rounded-2xl bg-slate-900/70 p-4">

              <div className="flex items-center gap-3">

                <UserCircle2
                  size={45}
                  className="text-amber-300"
                />

                <div>

                  <p className="font-semibold">
                    {user?.name}
                  </p>

                  <p className="text-xs text-slate-400">
                    {user?.email}
                  </p>

                  <span className="mt-2 inline-block rounded-full bg-amber-500/20 px-3 py-1 text-xs text-amber-300">
                    Administrator
                  </span>

                </div>

              </div>

              <button
                onClick={handleLogout}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-red-500/20 py-2 text-red-300 transition hover:bg-red-500/30"
              >
                <LogOut size={16} />
                Logout
              </button>

            </div>

            <p className="mt-5 text-center text-xs text-slate-500">
              Healthcare Appointment Manager
            </p>

            <p className="text-center text-xs text-slate-600">
              Version 1.0
            </p>

          </div>

        </aside>

        {/* Main */}

        <div className="flex flex-1 flex-col">

          {/* Navbar */}

          <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">

            <div className="flex items-center justify-between px-6 py-4">

              <div>

                <p className="text-sm text-amber-300">
                  Welcome Back
                </p>

                <h2 className="text-2xl font-bold">
                  Administrative Dashboard
                </h2>

              </div>

              <div className="flex items-center gap-4">

                <div className="hidden md:flex items-center gap-2 rounded-xl bg-white/5 px-4 py-2">

                  <Search size={18} />

                  <input
                    placeholder="Search..."
                    className="bg-transparent outline-none placeholder:text-slate-500"
                  />

                </div>

                <NotificationCenter />

                <div className="hidden lg:block text-right">

                  <p className="text-sm">
                    {new Date().toLocaleDateString()}
                  </p>

                  <p className="text-xs text-slate-500">
                    {new Date().toLocaleTimeString()}
                  </p>

                </div>

              </div>

            </div>

          </header>

          {/* Content */}

          <main className="flex-1 p-6">

            <motion.div
              key={location.pathname}
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.3,
              }}
            >
              <Outlet />
            </motion.div>

          </main>

        </div>

      </div>

    </div>
  );
}