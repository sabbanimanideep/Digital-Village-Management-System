// Pages/OfficerPages/UsersPage.jsx
import { Eye, Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getVillagersWithComplaints } from "../../Services/userManagementService";

const ROLE_COLOR = {
  "VILLAGER": "bg-slate-100 text-slate-600",
};

export default function UsersPage() {
  const navigate = useNavigate();
  const quickNavigate = (path) => navigate(path);

  const [data,     setData]     = useState({ totalVillagers: 0, users: [] });
  const [search,   setSearch]   = useState("");
  const [viewUser, setViewUser] = useState(null);

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    try {
      const res = await getVillagersWithComplaints();
      setData(res);
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = data.users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">

      {/* ── Inline Sidebar ── */}
      <aside className="w-64 bg-slate-900 flex flex-col shadow-2xl flex-shrink-0">
        <div className="flex items-center gap-3 px-4 py-5 border-b border-slate-700/60">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center flex-shrink-0 shadow-lg">
            <span className="text-white font-black text-sm">DV</span>
          </div>
          <div>
            <div className="text-white font-black text-lg tracking-tight leading-none">DVMS</div>
            <div className="text-slate-400 text-[10px] font-medium tracking-widest uppercase">Village Gov</div>
          </div>
        </div>
        <nav className="flex-1 px-2 py-4 space-y-1">
          {[
            { path: "/officer/dashboard",  label: "Dashboard"  },
            { path: "/officer/complaints", label: "Complaints" },
            { path: "/officer/users",      label: "Users"      },
            { path: "/officer/schemes",    label: "Schemes"    },
          ].map(({ path, label }) => (
            <button
              key={path}
              onClick={() => quickNavigate(path)}
              className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold transition-all
                ${window.location.pathname === path
                  ? "bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-lg"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"}`}
            >
              {label}
            </button>
          ))}
        </nav>
      </aside>

      {/* ── Main ── */}
      <div className="flex flex-col flex-1 overflow-hidden min-w-0">
        <header className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-6 shadow-sm flex-shrink-0">
          <div>
            <h2 className="text-xl font-black text-slate-900">User Management</h2>
            <p className="text-slate-400 text-xs">View and manage registered village users</p>
          </div>
          <button
            onClick={() => quickNavigate("/officer/dashboard")}
            className="text-sm text-slate-500 hover:text-blue-600 font-medium transition-colors"
          >
            ← Back to Dashboard
          </button>
        </header>

        <main className="flex-1 overflow-y-auto p-6 space-y-5">

          {/* Search bar */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex gap-3 items-center">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search by name or email…"
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              />
            </div>
            <span className="text-xs text-slate-400 ml-auto">Total Villagers: {data.totalVillagers}</span>
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    {["User", "Role", "Complaints", "View"].map(h => (
                      <th key={h} className="text-left px-5 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filtered.map((u, index) => (
                    <tr key={index} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-400 to-violet-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                            {u.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                          </div>
                          <div>
                            <div className="font-semibold text-slate-800">{u.name}</div>
                            <div className="text-xs text-slate-400">{u.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${ROLE_COLOR[u.role] || "bg-slate-100 text-slate-600"}`}>{u.role}</span>
                      </td>
                      <td className="px-5 py-3.5 text-slate-600 font-mono">{u.complaintCount}</td>
                      <td className="px-5 py-3.5">
                        <button onClick={() => setViewUser(u)}
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-600 text-xs font-semibold transition-colors">
                          <Eye className="w-3.5 h-3.5" /> View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* User Detail Modal */}
          {viewUser && (
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setViewUser(null)}>
              <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6" onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-5">
                  <span className="font-bold text-slate-800">User Details</span>
                  <button onClick={() => setViewUser(null)} className="p-1.5 rounded-lg hover:bg-slate-100"><X className="w-4 h-4" /></button>
                </div>
                <div className="flex flex-col items-center mb-5">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-400 to-violet-500 flex items-center justify-center text-white font-black text-xl mb-3">
                    {viewUser.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                  </div>
                  <div className="text-slate-800 font-bold text-lg">{viewUser.name}</div>
                  <div className="text-slate-400 text-sm">{viewUser.email}</div>
                </div>
                <div className="space-y-3 text-sm">
                  {[["Role", viewUser.role], ["Complaints Filed", viewUser.complaintCount]].map(([k, v]) => (
                    <div key={k} className="flex justify-between border-b border-slate-50 pb-2">
                      <span className="text-slate-400 font-medium">{k}</span>
                      <span className="text-slate-800 font-semibold">{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}