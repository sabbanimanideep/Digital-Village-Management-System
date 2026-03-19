import {
  AlertCircle,
  AlertTriangle,
  BarChart3,
  Bell,
  Check,
  CheckCircle,
  Eye,
  FileText,
  Filter,
  LayoutDashboard,
  Loader2,
  LogOut,
  Megaphone,
  Menu,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  UserCheck,
  Users,
  X
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis, YAxis
} from "recharts";

// ─── MOCK DATA ─────────────────────────────────────────────────────────────

const mockUsers = [
  { id: 1, name: "Arjun Reddy", email: "arjun@village.in", role: "Villager", status: "Active" },
  { id: 2, name: "Priya Sharma", email: "priya@village.in", role: "Officer", status: "Active" },
  { id: 3, name: "Ravi Kumar", email: "ravi@village.in", role: "Villager", status: "Inactive" },
  { id: 4, name: "Sunita Devi", email: "sunita@village.in", role: "Villager", status: "Active" },
  { id: 5, name: "Mohan Lal", email: "mohan@village.in", role: "Officer", status: "Active" },
  { id: 6, name: "Kavitha Rao", email: "kavitha@village.in", role: "Villager", status: "Active" },
  { id: 7, name: "Suresh Babu", email: "suresh@village.in", role: "Officer", status: "Inactive" },
];

const mockComplaints = [
  { id: 1, title: "Road damaged near market", user: "Arjun Reddy", status: "Pending", officer: "Priya Sharma", date: "2024-03-01", desc: "The main road near the market has large potholes causing accidents." },
  { id: 2, title: "Water supply disruption", user: "Sunita Devi", status: "In Progress", officer: "Mohan Lal", date: "2024-03-03", desc: "Water supply has been irregular for the past week in sector 4." },
  { id: 3, title: "Streetlight not working", user: "Ravi Kumar", status: "Resolved", officer: "Priya Sharma", date: "2024-02-28", desc: "Three streetlights on the main road have been non-functional." },
  { id: 4, title: "Drainage overflow issue", user: "Kavitha Rao", status: "Pending", officer: "Unassigned", date: "2024-03-05", desc: "Drainage overflows during rain causing flooding near school." },
  { id: 5, title: "Electricity outage", user: "Mohan Lal", status: "In Progress", officer: "Suresh Babu", date: "2024-03-07", desc: "Frequent power cuts lasting 4-6 hours daily." },
  { id: 6, title: "Garbage not collected", user: "Priya Sharma", status: "Resolved", officer: "Mohan Lal", date: "2024-03-02", desc: "Garbage collection has not happened in 2 weeks in our area." },
];

const mockSchemes = [
  { id: 1, name: "PM Awas Yojana", desc: "Housing for all scheme providing affordable homes to rural citizens.", status: "Active", beneficiaries: 240, category: "Housing" },
  { id: 2, name: "Kisan Samman Nidhi", desc: "Direct income support of ₹6000/year to small and marginal farmers.", status: "Active", beneficiaries: 512, category: "Agriculture" },
  { id: 3, name: "Ujjwala Yojana", desc: "Free LPG connections to women from BPL households.", status: "Inactive", beneficiaries: 180, category: "Energy" },
  { id: 4, name: "Jal Jeevan Mission", desc: "Providing safe drinking water to every rural household.", status: "Active", beneficiaries: 890, category: "Water" },
  { id: 5, name: "MNREGA", desc: "100 days of guaranteed wage employment in a financial year.", status: "Active", beneficiaries: 320, category: "Employment" },
  { id: 6, name: "Ayushman Bharat", desc: "Health coverage of ₹5 lakh per family per year.", status: "Inactive", beneficiaries: 410, category: "Health" },
];

const mockAnnouncements = [
  { id: 1, title: "Vaccination Drive — April 5th", desc: "Free COVID-19 and seasonal flu vaccinations at the community center.", date: "2024-03-20", sent: true },
  { id: 2, title: "Village Council Meeting", desc: "Monthly meeting of the village panchayat on March 28th at 10 AM.", date: "2024-03-18", sent: false },
  { id: 3, title: "Road Repair Notice", desc: "The main road will be closed for repair from March 22-25. Use alternate routes.", date: "2024-03-15", sent: true },
  { id: 4, title: "Water Supply Interruption", desc: "Water supply will be suspended on March 23rd for pipeline maintenance.", date: "2024-03-19", sent: false },
];

const complaintStatusData = [
  { name: "Pending", value: 2, color: "#f59e0b" },
  { name: "In Progress", value: 2, color: "#3b82f6" },
  { name: "Resolved", value: 2, color: "#10b981" },
];

const userRoleData = [
  { name: "Villagers", value: 4, color: "#6366f1" },
  { name: "Officers", value: 3, color: "#ec4899" },
];

const complaintsOverTime = [
  { month: "Oct", complaints: 4 },
  { month: "Nov", complaints: 7 },
  { month: "Dec", complaints: 5 },
  { month: "Jan", complaints: 9 },
  { month: "Feb", complaints: 6 },
  { month: "Mar", complaints: 12 },
];

const userGrowthData = [
  { month: "Oct", users: 18 },
  { month: "Nov", users: 22 },
  { month: "Dec", users: 25 },
  { month: "Jan", users: 30 },
  { month: "Feb", users: 35 },
  { month: "Mar", users: 42 },
];

const schemeUsageData = [
  { name: "PM Awas", users: 240 },
  { name: "Kisan", users: 512 },
  { name: "Ujjwala", users: 180 },
  { name: "Jal Jeevan", users: 890 },
  { name: "MNREGA", users: 320 },
  { name: "Ayushman", users: 410 },
];

// ─── TOAST ──────────────────────────────────────────────────────────────────

function Toast({ toasts, removeToast }) {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg text-white text-sm font-medium min-w-[260px] transition-all duration-300
            ${t.type === "success" ? "bg-emerald-500" : t.type === "error" ? "bg-red-500" : "bg-blue-500"}`}
        >
          {t.type === "success" ? <Check size={16} /> : t.type === "error" ? <X size={16} /> : <Bell size={16} />}
          <span className="flex-1">{t.message}</span>
          <button onClick={() => removeToast(t.id)} className="opacity-70 hover:opacity-100"><X size={14} /></button>
        </div>
      ))}
    </div>
  );
}

function useToast() {
  const [toasts, setToasts] = useState([]);
  const addToast = useCallback((message, type = "success") => {
    const id = Date.now();
    setToasts((p) => [...p, { id, message, type }]);
    setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), 3500);
  }, []);
  const removeToast = useCallback((id) => setToasts((p) => p.filter((t) => t.id !== id)), []);
  return { toasts, addToast, removeToast };
}

// ─── MODAL ──────────────────────────────────────────────────────────────────

function Modal({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600"><X size={18} /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ─── CONFIRM DELETE MODAL ────────────────────────────────────────────────────

function ConfirmDelete({ open, onClose, onConfirm, label }) {
  return (
    <Modal open={open} onClose={onClose} title="Confirm Delete">
      <p className="text-slate-600 mb-6">Are you sure you want to delete <span className="font-semibold text-slate-800">"{label}"</span>? This action cannot be undone.</p>
      <div className="flex gap-3 justify-end">
        <button onClick={onClose} className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-medium">Cancel</button>
        <button onClick={onConfirm} className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 text-sm font-medium flex items-center gap-2"><Trash2 size={14} /> Delete</button>
      </div>
    </Modal>
  );
}

// ─── SPINNER ─────────────────────────────────────────────────────────────────

function Spinner() {
  return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="animate-spin text-blue-500" size={36} />
    </div>
  );
}

// ─── EMPTY STATE ─────────────────────────────────────────────────────────────

function EmptyState({ icon: Icon, message }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-slate-400">
      <Icon size={40} className="mb-3 opacity-40" />
      <p className="text-sm">{message}</p>
    </div>
  );
}

// ─── STAT CARD ───────────────────────────────────────────────────────────────

function StatCard({ label, value, icon: Icon, color, bg }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 flex items-center gap-4 hover:shadow-md transition-shadow">
      <div className={`${bg} p-3 rounded-xl`}>
        <Icon size={22} className={color} />
      </div>
      <div>
        <p className="text-2xl font-bold text-slate-800">{value}</p>
        <p className="text-xs text-slate-500 font-medium mt-0.5">{label}</p>
      </div>
    </div>
  );
}

// ─── SIDEBAR ─────────────────────────────────────────────────────────────────

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/admin/dashboard" },
  { label: "Users", icon: Users, path: "/admin/users" },
  { label: "Complaints", icon: AlertCircle, path: "/admin/complaints" },
  { label: "Schemes", icon: FileText, path: "/admin/schemes" },
  { label: "Announcements", icon: Megaphone, path: "/admin/announcements" },
  { label: "Reports", icon: BarChart3, path: "/admin/reports" },
];

function Sidebar({ currentPath, onNavigate, open, onClose }) {
  return (
    <>
      {open && <div className="fixed inset-0 bg-black/30 z-20 md:hidden" onClick={onClose} />}
      <aside className={`fixed top-0 left-0 h-full w-60 bg-slate-900 z-30 flex flex-col transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}>
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
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map(({ label, icon: Icon, path }) => {
            const active = currentPath === path;
            return (
              <button
                key={path}
                onClick={() => { onNavigate(path); onClose(); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150
                  ${active ? "bg-blue-600 text-white shadow-lg shadow-blue-900/30" : "text-slate-400 hover:bg-slate-800 hover:text-white"}`}
              >
                <Icon size={18} />
                {label}
              </button>
            );
          })}
        </nav>
        <div className="px-3 py-4 border-t border-slate-800">
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:bg-red-900/30 hover:text-red-400 transition-all">
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}

// ─── NAVBAR ──────────────────────────────────────────────────────────────────

function Navbar({ currentPath, onMenuClick }) {
  const [notifOpen, setNotifOpen] = useState(false);
  const label = navItems.find((n) => n.path === currentPath)?.label || "Dashboard";
  return (
    <header className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-4 md:px-6 sticky top-0 z-10">
      <div className="flex items-center gap-3">
        <button onClick={onMenuClick} className="p-2 rounded-lg hover:bg-slate-100 md:hidden text-slate-500">
          <Menu size={20} />
        </button>
        <h1 className="text-lg font-semibold text-slate-800">{label}</h1>
      </div>
      <div className="flex items-center gap-2">
        <div className="relative">
          <button onClick={() => setNotifOpen(!notifOpen)} className="relative p-2 rounded-xl hover:bg-slate-100 text-slate-500">
            <Bell size={20} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
          </button>
          {notifOpen && (
            <div className="absolute right-0 top-12 w-72 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50">
              <p className="px-4 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wide">Notifications</p>
              {["New complaint filed by Arjun Reddy", "Scheme status updated", "3 pending complaints"].map((n, i) => (
                <div key={i} className="px-4 py-3 hover:bg-slate-50 border-b border-slate-50 last:border-0">
                  <p className="text-sm text-slate-700">{n}</p>
                  <p className="text-xs text-slate-400 mt-0.5">Just now</p>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200 ml-1">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold">A</div>
          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-slate-700 leading-tight">Admin</p>
            <p className="text-xs text-slate-400">Super Admin</p>
          </div>
        </div>
      </div>
    </header>
  );
}

// ─── DASHBOARD PAGE ──────────────────────────────────────────────────────────

function Dashboard() {
  const [loading, setLoading] = useState(true);
  useEffect(() => { const t = setTimeout(() => setLoading(false), 800); return () => clearTimeout(t); }, []);
  if (loading) return <Spinner />;
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        <StatCard label="Total Citizens" value="1,284" icon={Users} color="text-blue-600" bg="bg-blue-50" />
        <StatCard label="Total Officers" value="48" icon={UserCheck} color="text-indigo-600" bg="bg-indigo-50" />
        <StatCard label="Active Schemes" value="4" icon={FileText} color="text-emerald-600" bg="bg-emerald-50" />
        <StatCard label="Pending Complaints" value="2" icon={AlertTriangle} color="text-amber-600" bg="bg-amber-50" />
        <StatCard label="Completed Requests" value="96" icon={CheckCircle} color="text-teal-600" bg="bg-teal-50" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
          <h3 className="font-semibold text-slate-800 mb-4 text-sm">Complaint Status Distribution</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={complaintStatusData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={4} dataKey="value">
                {complaintStatusData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip />
              <Legend iconType="circle" iconSize={8} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
          <h3 className="font-semibold text-slate-800 mb-4 text-sm">User Role Distribution</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={userRoleData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={4} dataKey="value">
                {userRoleData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip />
              <Legend iconType="circle" iconSize={8} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

// ─── USERS PAGE ──────────────────────────────────────────────────────────────

function UsersPage({ toast }) {
  const [users, setUsers] = useState(mockUsers);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", role: "Villager" });
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => { const t = setTimeout(() => setLoading(false), 600); return () => clearTimeout(t); }, []);

  const filtered = users.filter((u) =>
    (roleFilter === "All" || u.role === roleFilter) &&
    (u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()))
  );

  const openAdd = () => { setForm({ name: "", email: "", role: "Villager" }); setModal("add"); };
  const openEdit = (u) => { setForm({ ...u }); setModal("edit"); };

  const handleSave = () => {
    if (!form.name || !form.email) { toast("Please fill all fields", "error"); return; }
    if (modal === "add") {
      setUsers((p) => [...p, { ...form, id: Date.now(), status: "Active" }]);
      toast("User added successfully");
    } else {
      setUsers((p) => p.map((u) => (u.id === form.id ? { ...u, ...form } : u)));
      toast("User updated successfully");
    }
    setModal(null);
  };

  const handleDelete = () => {
    setUsers((p) => p.filter((u) => u.id !== deleteTarget.id));
    toast("User deleted");
    setDeleteTarget(null);
  };

  if (loading) return <Spinner />;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex gap-2 flex-wrap">
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search users..." className="pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 w-52" />
          </div>
          <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
            {["All", "Villager", "Officer"].map((r) => <option key={r}>{r}</option>)}
          </select>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors">
          <Plus size={16} /> Add User
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {filtered.length === 0 ? <EmptyState icon={Users} message="No users found" /> : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="bg-slate-50 border-b border-slate-100">
                {["Name", "Email", "Role", "Status", "Actions"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {filtered.map((u) => (
                  <tr key={u.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-3 font-medium text-slate-800">{u.name}</td>
                    <td className="px-4 py-3 text-slate-500">{u.email}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${u.role === "Officer" ? "bg-indigo-100 text-indigo-700" : "bg-blue-100 text-blue-700"}`}>{u.role}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${u.status === "Active" ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>{u.status}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <button onClick={() => openEdit(u)} className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-500 hover:text-blue-700 transition-colors"><Pencil size={14} /></button>
                        <button onClick={() => setDeleteTarget(u)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-400 hover:text-red-600 transition-colors"><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal open={!!modal} onClose={() => setModal(null)} title={modal === "add" ? "Add New User" : "Edit User"}>
        <div className="space-y-4">
          {["name", "email"].map((field) => (
            <div key={field}>
              <label className="block text-sm font-medium text-slate-700 mb-1 capitalize">{field}</label>
              <input value={form[field] || ""} onChange={(e) => setForm((p) => ({ ...p, [field]: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          ))}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
            <select value={form.role} onChange={(e) => setForm((p) => ({ ...p, role: e.target.value }))}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
              {["Villager", "Officer"].map((r) => <option key={r}>{r}</option>)}
            </select>
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <button onClick={() => setModal(null)} className="px-4 py-2 border border-slate-200 rounded-xl text-sm text-slate-600 hover:bg-slate-50">Cancel</button>
            <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700">Save</button>
          </div>
        </div>
      </Modal>

      <ConfirmDelete open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} label={deleteTarget?.name} />
    </div>
  );
}

// ─── COMPLAINTS PAGE ─────────────────────────────────────────────────────────

const statusColors = {
  Pending: "bg-amber-100 text-amber-700",
  "In Progress": "bg-blue-100 text-blue-700",
  Resolved: "bg-emerald-100 text-emerald-700",
};

function ComplaintsPage({ toast }) {
  const [complaints, setComplaints] = useState(mockComplaints);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [viewItem, setViewItem] = useState(null);
  const [editItem, setEditItem] = useState(null);

  useEffect(() => { const t = setTimeout(() => setLoading(false), 700); return () => clearTimeout(t); }, []);

  const filtered = complaints.filter((c) => filter === "All" || c.status === filter);

  const updateStatus = (id, status) => {
    setComplaints((p) => p.map((c) => (c.id === id ? { ...c, status } : c)));
    toast(`Status updated to ${status}`);
    setEditItem(null);
  };

  if (loading) return <Spinner />;

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        {["All", "Pending", "In Progress", "Resolved"].map((s) => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${filter === s ? "bg-blue-600 text-white" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"}`}>
            {s}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {filtered.length === 0 ? <EmptyState icon={AlertCircle} message="No complaints found" /> : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="bg-slate-50 border-b border-slate-100">
                {["Title", "Filed By", "Officer", "Status", "Date", "Actions"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {filtered.map((c) => (
                  <tr key={c.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-3 font-medium text-slate-800 max-w-[180px] truncate">{c.title}</td>
                    <td className="px-4 py-3 text-slate-500">{c.user}</td>
                    <td className="px-4 py-3 text-slate-500">{c.officer}</td>
                    <td className="px-4 py-3"><span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[c.status]}`}>{c.status}</span></td>
                    <td className="px-4 py-3 text-slate-400">{c.date}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <button onClick={() => setViewItem(c)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600"><Eye size={14} /></button>
                        <button onClick={() => setEditItem(c)} className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-400 hover:text-blue-600"><RefreshCw size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal open={!!viewItem} onClose={() => setViewItem(null)} title="Complaint Details">
        {viewItem && (
          <div className="space-y-3">
            <div><p className="text-xs text-slate-400 uppercase font-semibold">Title</p><p className="font-semibold text-slate-800 mt-0.5">{viewItem.title}</p></div>
            <div><p className="text-xs text-slate-400 uppercase font-semibold">Description</p><p className="text-slate-600 mt-0.5 text-sm">{viewItem.desc}</p></div>
            <div className="grid grid-cols-2 gap-3">
              <div><p className="text-xs text-slate-400 uppercase font-semibold">Filed By</p><p className="text-slate-700 mt-0.5 text-sm">{viewItem.user}</p></div>
              <div><p className="text-xs text-slate-400 uppercase font-semibold">Officer</p><p className="text-slate-700 mt-0.5 text-sm">{viewItem.officer}</p></div>
              <div><p className="text-xs text-slate-400 uppercase font-semibold">Status</p><span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium mt-0.5 ${statusColors[viewItem.status]}`}>{viewItem.status}</span></div>
              <div><p className="text-xs text-slate-400 uppercase font-semibold">Date</p><p className="text-slate-700 mt-0.5 text-sm">{viewItem.date}</p></div>
            </div>
          </div>
        )}
      </Modal>

      <Modal open={!!editItem} onClose={() => setEditItem(null)} title="Update Complaint Status">
        {editItem && (
          <div className="space-y-4">
            <p className="text-sm text-slate-600">Update status for: <span className="font-medium text-slate-800">{editItem.title}</span></p>
            <div className="grid grid-cols-1 gap-2">
              {["Pending", "In Progress", "Resolved"].map((s) => (
                <button key={s} onClick={() => updateStatus(editItem.id, s)}
                  className={`w-full py-2.5 rounded-xl text-sm font-medium border transition-colors ${editItem.status === s ? "border-blue-500 bg-blue-50 text-blue-700" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

// ─── SCHEMES PAGE ────────────────────────────────────────────────────────────

function SchemesPage({ toast }) {
  const [schemes, setSchemes] = useState(mockSchemes);
  const [loading, setLoading] = useState(true);
  const [editItem, setEditItem] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [viewItem, setViewItem] = useState(null);
  const [form, setForm] = useState({});

  useEffect(() => { const t = setTimeout(() => setLoading(false), 600); return () => clearTimeout(t); }, []);

  const toggleStatus = (id) => {
    setSchemes((p) => p.map((s) => s.id === id ? { ...s, status: s.status === "Active" ? "Inactive" : "Active" } : s));
    toast("Scheme status updated");
  };

  const openEdit = (s) => { setForm({ ...s }); setEditItem(s); };

  const handleSave = () => {
    setSchemes((p) => p.map((s) => s.id === form.id ? { ...s, ...form } : s));
    toast("Scheme updated");
    setEditItem(null);
  };

  const handleDelete = () => {
    setSchemes((p) => p.filter((s) => s.id !== deleteTarget.id));
    toast("Scheme deleted");
    setDeleteTarget(null);
  };

  if (loading) return <Spinner />;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {schemes.length === 0 ? <EmptyState icon={FileText} message="No schemes found" /> : schemes.map((s) => (
          <div key={s.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="font-semibold text-slate-800 text-sm">{s.name}</h3>
                <span className="text-xs text-slate-400">{s.category}</span>
              </div>
              <button onClick={() => toggleStatus(s.id)}
                className={`px-2.5 py-1 rounded-full text-xs font-medium cursor-pointer transition-colors ${s.status === "Active" ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200" : "bg-slate-100 text-slate-500 hover:bg-slate-200"}`}>
                {s.status}
              </button>
            </div>
            <p className="text-sm text-slate-500 mb-4 line-clamp-2">{s.desc}</p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">{s.beneficiaries} beneficiaries</span>
              <div className="flex gap-1">
                <button onClick={() => setViewItem(s)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400"><Eye size={14} /></button>
                <button onClick={() => openEdit(s)} className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-400"><Pencil size={14} /></button>
                <button onClick={() => setDeleteTarget(s)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-400"><Trash2 size={14} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal open={!!viewItem} onClose={() => setViewItem(null)} title="Scheme Details">
        {viewItem && (
          <div className="space-y-3">
            <div><p className="text-xs text-slate-400 uppercase font-semibold">Name</p><p className="font-semibold text-slate-800 mt-0.5">{viewItem.name}</p></div>
            <div><p className="text-xs text-slate-400 uppercase font-semibold">Description</p><p className="text-sm text-slate-600 mt-0.5">{viewItem.desc}</p></div>
            <div className="grid grid-cols-2 gap-3">
              <div><p className="text-xs text-slate-400 uppercase font-semibold">Category</p><p className="text-slate-700 text-sm mt-0.5">{viewItem.category}</p></div>
              <div><p className="text-xs text-slate-400 uppercase font-semibold">Status</p><span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium mt-0.5 ${viewItem.status === "Active" ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>{viewItem.status}</span></div>
              <div><p className="text-xs text-slate-400 uppercase font-semibold">Beneficiaries</p><p className="text-slate-700 text-sm mt-0.5">{viewItem.beneficiaries}</p></div>
            </div>
          </div>
        )}
      </Modal>

      <Modal open={!!editItem} onClose={() => setEditItem(null)} title="Edit Scheme">
        <div className="space-y-4">
          <div><label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
            <input value={form.name || ""} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
          <div><label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
            <textarea value={form.desc || ""} onChange={(e) => setForm((p) => ({ ...p, desc: e.target.value }))} rows={3} className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" /></div>
          <div><label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
            <input value={form.category || ""} onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))} className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
          <div className="flex gap-3 justify-end pt-1">
            <button onClick={() => setEditItem(null)} className="px-4 py-2 border border-slate-200 rounded-xl text-sm text-slate-600 hover:bg-slate-50">Cancel</button>
            <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700">Save Changes</button>
          </div>
        </div>
      </Modal>

      <ConfirmDelete open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} label={deleteTarget?.name} />
    </div>
  );
}

// ─── ANNOUNCEMENTS PAGE ──────────────────────────────────────────────────────

function AnnouncementsPage({ toast }) {
  const [items, setItems] = useState(mockAnnouncements);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({ title: "", desc: "" });
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => { const t = setTimeout(() => setLoading(false), 600); return () => clearTimeout(t); }, []);

  const openAdd = () => { setForm({ title: "", desc: "" }); setModal("add"); };
  const openEdit = (a) => { setForm({ ...a }); setModal("edit"); };

  const handleSave = () => {
    if (!form.title) { toast("Title is required", "error"); return; }
    if (modal === "add") {
      setItems((p) => [...p, { ...form, id: Date.now(), date: new Date().toISOString().slice(0, 10), sent: false }]);
      toast("Announcement published");
    } else {
      setItems((p) => p.map((a) => (a.id === form.id ? { ...a, ...form } : a)));
      toast("Announcement updated");
    }
    setModal(null);
  };

  const sendNotif = (id) => {
    setItems((p) => p.map((a) => (a.id === id ? { ...a, sent: true } : a)));
    toast("Notification sent to all citizens", "info");
  };

  const handleDelete = () => {
    setItems((p) => p.filter((a) => a.id !== deleteTarget.id));
    toast("Announcement deleted");
    setDeleteTarget(null);
  };

  if (loading) return <Spinner />;

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors">
          <Plus size={16} /> New Announcement
        </button>
      </div>

      {items.length === 0 ? <EmptyState icon={Megaphone} message="No announcements yet" /> : (
        <div className="space-y-3">
          {items.map((a) => (
            <div key={a.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-slate-800 text-sm">{a.title}</h3>
                    {a.sent && <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs rounded-full font-medium">Sent</span>}
                  </div>
                  <p className="text-sm text-slate-500 mb-2">{a.desc}</p>
                  <p className="text-xs text-slate-400">{a.date}</p>
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  {!a.sent && (
                    <button onClick={() => sendNotif(a.id)} title="Send Notification" className="p-1.5 rounded-lg hover:bg-amber-50 text-amber-400 hover:text-amber-600"><Bell size={14} /></button>
                  )}
                  <button onClick={() => openEdit(a)} className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-400 hover:text-blue-600"><Pencil size={14} /></button>
                  <button onClick={() => setDeleteTarget(a)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-400 hover:text-red-600"><Trash2 size={14} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={!!modal} onClose={() => setModal(null)} title={modal === "add" ? "New Announcement" : "Edit Announcement"}>
        <div className="space-y-4">
          <div><label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
            <input value={form.title || ""} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
          <div><label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
            <textarea value={form.desc || ""} onChange={(e) => setForm((p) => ({ ...p, desc: e.target.value }))} rows={3} className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" /></div>
          <div className="flex gap-3 justify-end pt-1">
            <button onClick={() => setModal(null)} className="px-4 py-2 border border-slate-200 rounded-xl text-sm text-slate-600 hover:bg-slate-50">Cancel</button>
            <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700">Publish</button>
          </div>
        </div>
      </Modal>

      <ConfirmDelete open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} label={deleteTarget?.title} />
    </div>
  );
}

// ─── REPORTS PAGE ────────────────────────────────────────────────────────────

function ReportsPage() {
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState("last6months");
  const [category, setCategory] = useState("All");

  useEffect(() => { const t = setTimeout(() => setLoading(false), 900); return () => clearTimeout(t); }, []);
  if (loading) return <Spinner />;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-3 items-center bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
        <Filter size={16} className="text-slate-400" />
        <select value={dateRange} onChange={(e) => setDateRange(e.target.value)} className="px-3 py-1.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
          <option value="last6months">Last 6 Months</option>
          <option value="last3months">Last 3 Months</option>
          <option value="lastyear">Last Year</option>
        </select>
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="px-3 py-1.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
          {["All", "Complaints", "Users", "Schemes"].map((c) => <option key={c}>{c}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
          <h3 className="font-semibold text-slate-800 text-sm mb-4">Complaints Over Time</h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={complaintsOverTime}>
              <defs>
                <linearGradient id="cg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <Tooltip />
              <Area type="monotone" dataKey="complaints" stroke="#3b82f6" fill="url(#cg)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
          <h3 className="font-semibold text-slate-800 text-sm mb-4">User Growth</h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={userGrowthData}>
              <defs>
                <linearGradient id="ug" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <Tooltip />
              <Area type="monotone" dataKey="users" stroke="#6366f1" fill="url(#ug)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 lg:col-span-2">
          <h3 className="font-semibold text-slate-800 text-sm mb-4">Scheme Usage (Beneficiaries)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={schemeUsageData} barSize={32}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <Tooltip />
              <Bar dataKey="users" fill="#10b981" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

// ─── APP SHELL ────────────────────────────────────────────────────────────────

const ROUTES = {
  "/admin/dashboard": Dashboard,
  "/admin/users": UsersPage,
  "/admin/complaints": ComplaintsPage,
  "/admin/schemes": SchemesPage,
  "/admin/announcements": AnnouncementsPage,
  "/admin/reports": ReportsPage,
};

export default function App() {
  const [currentPath, setCurrentPath] = useState("/admin/dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { toasts, addToast, removeToast } = useToast();

  const navigate = (path) => setCurrentPath(path);

  const PageComponent = ROUTES[currentPath] || Dashboard;

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Sidebar currentPath={currentPath} onNavigate={navigate} open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="md:ml-60 flex flex-col min-h-screen">
        <Navbar currentPath={currentPath} onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 p-4 md:p-6">
          <PageComponent toast={addToast} />
        </main>
      </div>
      <Toast toasts={toasts} removeToast={removeToast} />
    </div>
  );
}