import {
  AlertCircle,
  BarChart3,
  Bell,
  FileText,
  LayoutDashboard,
  LogOut,
  Megaphone,
  Menu,
  Users,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";


export const navItems = [
  { label: "Dashboard",     icon: LayoutDashboard, path: "/admin/dashboard"     },
  { label: "Users",         icon: Users,           path: "/admin/users"         },
  { label: "Complaints",    icon: AlertCircle,     path: "/admin/complaints"    },
  { label: "Schemes",       icon: FileText,        path: "/admin/schemes"       },
  { label: "Announcements", icon: Megaphone,       path: "/admin/announcements" },
  { label: "Reports",       icon: BarChart3,       path: "/admin/reports"       },
];

// ─── SIDEBAR ──────────────────────────────────────────────────────────────────

export function Sidebar({ currentPath, onNavigate, open, onClose }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");       // remove JWT
    localStorage.removeItem("user");        // remove any stored user info (if present)
    navigate("/login");
  };

  return (
    <>
      {/* Mobile backdrop */}
      {open && (
        <div
          className="fixed inset-0 bg-black/30 z-20 md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-full w-60 bg-slate-900 z-30 flex flex-col transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        {/* Logo */}
        <div className="px-5 py-5 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center">
              <LayoutDashboard size={16} className="text-white" />
            </div>
            <div>
              <p className="text-white font-bold text-sm leading-tight">GramSeva</p>
              <p className="text-slate-400 text-xs">Admin Portal</p>
            </div>
          </div>
        </div>

        {/* Navigation links */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map(({ label, icon: Icon, path }) => {
            const active = currentPath === path;
            return (
              <button
                key={path}
                onClick={() => { onNavigate(path); onClose(); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150
                  ${active
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-900/30"
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                  }`}
              >
                <Icon size={18} />
                {label}
              </button>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="px-3 py-4 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:bg-red-900/30 hover:text-red-400 transition-all"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}

// ─── NAVBAR ───────────────────────────────────────────────────────────────────

export function Navbar({ currentPath, onMenuClick }) {
  const [notifOpen, setNotifOpen] = useState(false);
  const label = navItems.find((n) => n.path === currentPath)?.label || "Dashboard";

  return (
    <header className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-4 md:px-6 sticky top-0 z-10">
      {/* Left: hamburger + page title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="p-2 rounded-lg hover:bg-slate-100 md:hidden text-slate-500"
        >
          <Menu size={20} />
        </button>
        <h1 className="text-lg font-semibold text-slate-800">{label}</h1>
      </div>

      {/* Right: notifications + avatar */}
      <div className="flex items-center gap-2">
        {/* Notification bell */}
        <div className="relative">
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative p-2 rounded-xl hover:bg-slate-100 text-slate-500"
          >
            <Bell size={20} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
          </button>

          {notifOpen && (
            <div className="absolute right-0 top-12 w-72 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50">
              <p className="px-4 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wide">
                Notifications
              </p>
              {[
                "New complaint filed by Arjun Reddy",
                "Scheme status updated",
                "3 pending complaints",
              ].map((n, i) => (
                <div
                  key={i}
                  className="px-4 py-3 hover:bg-slate-50 border-b border-slate-50 last:border-0"
                >
                  <p className="text-sm text-slate-700">{n}</p>
                  <p className="text-xs text-slate-400 mt-0.5">Just now</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* User avatar */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200 ml-1">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold">
            A
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-slate-700 leading-tight">Admin</p>
            <p className="text-xs text-slate-400">Super Admin</p>
          </div>
        </div>
      </div>
    </header>
  );
}