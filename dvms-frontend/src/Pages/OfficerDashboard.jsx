// Pages/OfficerPages/OfficerDashboard.jsx
import {
  AlertCircle, ArrowUpRight, Bell, BookOpen,
  CheckCircle2, ChevronDown, Clock, LayoutDashboard,
  LogOut, MapPin, Menu, MessageSquareWarning, RefreshCw,
  Shield, Users, X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getDashboardData } from "../Services/dashboardService";

// ─── Nav config ───────────────────────────────────────────────

const NAV = [
  { key: "dashboard",  label: "Dashboard",  path: "/officer/dashboard",  icon: LayoutDashboard     },
  { key: "complaints", label: "Complaints", path: "/officer/complaints", icon: MessageSquareWarning },
  { key: "users",      label: "Users",      path: "/officer/users",      icon: Users                },
  { key: "schemes",    label: "Schemes",    path: "/officer/schemes",    icon: BookOpen             },
];

const PAGE_META = {
  "/officer/dashboard":  { title: "Dashboard",          desc: "Overview of village activity and complaint status" },
  "/officer/complaints": { title: "Complaints",         desc: "Manage and track all registered complaints"        },
  "/officer/users":      { title: "User Management",    desc: "View and manage registered village users"           },
  "/officer/schemes":    { title: "Government Schemes", desc: "Publish schemes and review citizen applications"    },
};

// ─── Summary Card ─────────────────────────────────────────────

const SummaryCard = ({ label, count, icon: Icon, gradient, trend }) => (
  <div className={`relative overflow-hidden rounded-2xl p-6 ${gradient} shadow-lg group hover:scale-[1.02] transition-transform duration-200 cursor-pointer`}>
    <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full bg-white/10 group-hover:bg-white/15 transition-colors" />
    <div className="absolute -bottom-6 -right-2 w-16 h-16 rounded-full bg-white/10" />
    <div className="relative">
      <div className="flex items-center justify-between mb-4">
        <div className="bg-white/20 rounded-xl p-2.5">
          <Icon className="w-6 h-6 text-white" />
        </div>
        <span className="text-white/70 text-xs flex items-center gap-1">
          <ArrowUpRight className="w-3 h-3" />{trend}
        </span>
      </div>
      <div className="text-4xl font-black text-white mb-1">{count}</div>
      <div className="text-white/80 text-sm font-medium">{label}</div>
    </div>
  </div>
);

// ─── Sidebar ─────────────────────────────────────────────────

const Sidebar = ({ collapsed, setCollapsed }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const quickNavigate = (path) => navigate(path);

  return (
    <aside className={`${collapsed ? "w-16" : "w-64"} transition-all duration-300 bg-slate-900 flex flex-col shadow-2xl z-20 flex-shrink-0`}>
      <div className="flex items-center gap-3 px-4 py-5 border-b border-slate-700/60">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center flex-shrink-0 shadow-lg">
          <Shield className="w-5 h-5 text-white" />
        </div>
        {!collapsed && (
          <div>
            <div className="text-white font-black text-lg tracking-tight leading-none">DVMS</div>
            <div className="text-slate-400 text-[10px] font-medium tracking-widest uppercase">Village Gov</div>
          </div>
        )}
      </div>
      <nav className="flex-1 px-2 py-4 space-y-1">
        {NAV.map(({ path, label, icon: Icon }) => {
          const isActive = location.pathname === path;
          return (
            <button
              key={path}
              onClick={() => quickNavigate(path)}
              title={collapsed ? label : undefined}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 group
                ${isActive
                  ? "bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-lg shadow-blue-900/40"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"}`}
            >
              <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? "text-white" : "text-slate-400 group-hover:text-white"}`} />
              {!collapsed && <span className="text-sm font-semibold">{label}</span>}
            </button>
          );
        })}
      </nav>
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="m-3 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors flex items-center justify-center"
      >
        {collapsed ? <Menu className="w-4 h-4" /> : <X className="w-4 h-4" />}
      </button>
    </aside>
  );
};

// ─── Topbar ───────────────────────────────────────────────────

const Topbar = ({ officerName }) => {
  const navigate = useNavigate();
  const initials = officerName
    ? officerName.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()
    : "OF";

  return (
    <header className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-6 shadow-sm flex-shrink-0 z-10">
      <div>
        <h1 className="text-slate-800 font-black text-lg leading-none">Officer Portal</h1>
        <p className="text-slate-400 text-xs mt-0.5 flex items-center gap-1">
          <MapPin className="w-3 h-3" /> Peechara Gram Panchayat
        </p>
      </div>
      <div className="flex items-center gap-3">
        <button className="relative p-2 rounded-xl hover:bg-slate-100 transition-colors">
          <Bell className="w-5 h-5 text-slate-500" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 border border-white" />
        </button>
        <div className="flex items-center gap-2.5 pl-3 border-l border-slate-200">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white font-bold text-sm shadow">
            {initials}
          </div>
          <div className="hidden sm:block">
            <div className="text-slate-800 text-sm font-bold leading-none">{officerName || "Officer"}</div>
            <div className="text-slate-400 text-xs mt-0.5">Senior Officer</div>
          </div>
          <ChevronDown className="w-4 h-4 text-slate-400" />
        </div>
        <button
          onClick={() => navigate("/login")}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors text-sm font-semibold"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
};

// ─── Dashboard Page content ───────────────────────────────────

const DashboardPage = ({ data }) => {
  const navigate = useNavigate();
  const quickNavigate = (path) => navigate(path);

  const total    = data.totalComplaints ?? 0;
  const pending  = data.pending         ?? 0;
  const inProg   = data.inProgress      ?? 0;
  const resolved = data.resolved        ?? 0;

  return (
    <div className="space-y-6">

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div onClick={() => quickNavigate("/officer/complaints")}>
          <SummaryCard label="Total Complaints" count={total}    icon={MessageSquareWarning} gradient="bg-gradient-to-br from-slate-700 to-slate-900"  trend="+12% this month" />
        </div>
        <div onClick={() => quickNavigate("/officer/complaints")}>
          <SummaryCard label="Pending"          count={pending}  icon={AlertCircle}          gradient="bg-gradient-to-br from-amber-500 to-orange-600"   trend="+3 today" />
        </div>
        <div onClick={() => quickNavigate("/officer/complaints")}>
          <SummaryCard label="In Progress"      count={inProg}   icon={Clock}                gradient="bg-gradient-to-br from-blue-500 to-violet-600"     trend="Active now" />
        </div>
        <div onClick={() => quickNavigate("/officer/complaints")}>
          <SummaryCard label="Resolved"         count={resolved} icon={CheckCircle2}         gradient="bg-gradient-to-br from-emerald-500 to-teal-600"    trend="↑ 85% rate" />
        </div>
      </div>

      {/* Villagers + Welcome */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col items-center justify-center gap-2">
          <Users className="w-8 h-8 text-violet-500" />
          <div className="text-4xl font-black text-slate-800">{data.totalVillagers ?? 0}</div>
          <div className="text-slate-500 text-sm font-medium">Total Villagers</div>
        </div>

        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white font-black text-2xl shadow flex-shrink-0">
            {data.officerName
              ? data.officerName.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()
              : "OF"}
          </div>
          <div>
            <div className="text-slate-400 text-xs font-medium uppercase tracking-wide mb-1">Welcome back</div>
            <div className="text-slate-800 font-black text-xl">{data.officerName || "Officer"}</div>
            <div className="text-slate-500 text-sm mt-1">
              You have <span className="font-bold text-amber-600">{pending}</span> pending complaints to review.
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

// ─── Loading Spinner ─────────────────────────────────────────

const LoadingSpinner = () => (
  <div className="flex flex-col items-center justify-center h-64 gap-3">
    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 animate-pulse" />
    <p className="text-slate-400 text-sm">Loading data…</p>
  </div>
);

// ─── OfficerDashboard (root) ──────────────────────────────────

export default function OfficerDashboard() {
  const location = useLocation();
  const user     = JSON.parse(localStorage.getItem("user"));

  const [collapsed, setCollapsed] = useState(false);
  const [data,      setData]      = useState(null);
  const [loading,   setLoading]   = useState(true);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await getDashboardData(user?.name);
      setData(res);
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  const meta = PAGE_META[location.pathname] ?? PAGE_META["/officer/dashboard"];

  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">

      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <div className="flex flex-col flex-1 overflow-hidden min-w-0">
        <Topbar officerName={data?.officerName} />

        <main className="flex-1 overflow-y-auto p-6">

          {/* Page header */}
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-black text-slate-900">{meta.title}</h2>
              <p className="text-slate-400 text-sm mt-0.5">{meta.desc}</p>
            </div>
            <button
              onClick={fetchData}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-blue-600 hover:border-blue-300 transition-colors text-sm font-medium shadow-sm"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </button>
          </div>

          {loading ? (
            <LoadingSpinner />
          ) : data ? (
            <DashboardPage data={data} />
          ) : (
            <p className="text-slate-400 text-sm text-center mt-20">Failed to load dashboard data.</p>
          )}

        </main>
      </div>
    </div>
  );
}