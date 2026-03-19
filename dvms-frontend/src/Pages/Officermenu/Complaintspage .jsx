// Pages/OfficerPages/ComplaintsPage.jsx
import { Eye, Filter, Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllComplaints, updateComplaintStatus } from "../../Services/complaintStatusService";

const StatusBadge = ({ status }) => {
  const cfg = {
    "Pending":     "bg-amber-100 text-amber-700 border border-amber-200",
    "In Progress": "bg-blue-100 text-blue-700 border border-blue-200",
    "IN_PROGRESS": "bg-blue-100 text-blue-700 border border-blue-200",
    "Resolved":    "bg-emerald-100 text-emerald-700 border border-emerald-200",
    "RESOLVED":    "bg-emerald-100 text-emerald-700 border border-emerald-200",
  };
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide ${cfg[status] || "bg-gray-100 text-gray-600"}`}>
      {status}
    </span>
  );
};

const PriorityBadge = ({ priority }) => {
  const cfg = {
    "High":   "text-rose-600 font-bold",
    "Medium": "text-amber-600 font-semibold",
    "Low":    "text-slate-500 font-medium",
  };
  return <span className={`text-xs ${cfg[priority] || "text-slate-500 font-medium"}`}>⬤ {priority}</span>;
};

export default function ComplaintsPage() {
  const navigate = useNavigate();
  const quickNavigate = (path) => navigate(path);

  const [complaints,     setComplaints]     = useState([]);
  const [filterStatus,   setFilterStatus]   = useState("All");
  const [filterCategory, setFilterCategory] = useState("All");
  const [search,         setSearch]         = useState("");
  const [viewDetail,     setViewDetail]     = useState(null);

  useEffect(() => { fetchComplaints(); }, []);

  const fetchComplaints = async () => {
    try {
      const data = await getAllComplaints();
      setComplaints(data);
    } catch (err) {
      console.error("Failed to fetch complaints:", err);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      await updateComplaintStatus(id, newStatus);
      fetchComplaints();
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  const categories = ["All", ...new Set(complaints.map(c => c.category).filter(Boolean))];

  const filtered = complaints.filter(c => {
    const matchS = filterStatus   === "All" || c.status   === filterStatus;
    const matchC = filterCategory === "All" || c.category === filterCategory;
    const matchQ = !search
      || (c.id   && c.id.toString().toLowerCase().includes(search.toLowerCase()))
      || (c.email && c.email.toLowerCase().includes(search.toLowerCase()));
    return matchS && matchC && matchQ;
  });

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
            <h2 className="text-xl font-black text-slate-900">Complaints</h2>
            <p className="text-slate-400 text-xs">Manage and track all registered complaints</p>
          </div>
          <button
            onClick={() => quickNavigate("/officer/dashboard")}
            className="text-sm text-slate-500 hover:text-blue-600 font-medium transition-colors"
          >
            ← Back to Dashboard
          </button>
        </header>

        <main className="flex-1 overflow-y-auto p-6 space-y-5">

          {/* Filter Bar */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex flex-wrap gap-3 items-center">
            <div className="relative flex-1 min-w-48">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search by ID or email…"
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400"
              />
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Filter className="w-4 h-4 text-slate-400" />
              <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
                className="text-sm border border-slate-200 rounded-xl px-3 py-2 focus:outline-none bg-white">
                {["All", "Pending", "IN_PROGRESS", "RESOLVED"].map(s => <option key={s}>{s}</option>)}
              </select>
              <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)}
                className="text-sm border border-slate-200 rounded-xl px-3 py-2 focus:outline-none bg-white">
                {categories.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <span className="text-xs text-slate-400 ml-auto">{filtered.length} of {complaints.length} records</span>
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    {["ID", "Title", "Email", "Category", "Priority", "Status", "Date", "Actions"].map(h => (
                      <th key={h} className="text-left px-5 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filtered.length === 0 ? (
                    <tr><td colSpan={8} className="text-center py-12 text-slate-400 text-sm">No complaints match the current filters.</td></tr>
                  ) : filtered.map(c => (
                    <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-5 py-3.5">
                        <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">{c.id}</span>
                      </td>
                      <td className="px-5 py-3.5 text-slate-700 font-medium max-w-[160px] truncate">{c.title}</td>
                      <td className="px-5 py-3.5 text-slate-600 text-xs max-w-[160px] truncate">{c.email}</td>
                      <td className="px-5 py-3.5 text-slate-700 font-medium whitespace-nowrap">{c.category}</td>
                      <td className="px-5 py-3.5"><PriorityBadge priority={c.priority} /></td>
                      <td className="px-5 py-3.5"><StatusBadge status={c.status} /></td>
                      <td className="px-5 py-3.5 text-xs text-slate-400 whitespace-nowrap">{c.date}</td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <select value={c.status} onChange={e => updateStatus(c.id, e.target.value)}
                            className="text-xs border border-slate-200 rounded-lg px-2 py-1.5 focus:outline-none bg-white cursor-pointer">
                            <option value="Pending">Pending</option>
                            <option value="IN_PROGRESS">In Progress</option>
                            <option value="RESOLVED">Resolved</option>
                          </select>
                          <button onClick={() => setViewDetail(c)}
                            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-600 text-xs font-semibold transition-colors">
                            <Eye className="w-3.5 h-3.5" /> View
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Detail Modal */}
          {viewDetail && (
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setViewDetail(null)}>
              <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6" onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-5">
                  <span className="font-mono text-sm font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-lg">{viewDetail.id}</span>
                  <button onClick={() => setViewDetail(null)} className="p-1.5 rounded-lg hover:bg-slate-100">
                    <X className="w-4 h-4 text-slate-500" />
                  </button>
                </div>
                <div className="space-y-3 text-sm">
                  {[["Title", viewDetail.title], ["Email", viewDetail.email], ["Category", viewDetail.category], ["Priority", viewDetail.priority], ["Date Filed", viewDetail.date]].map(([k, v]) => (
                    <div key={k} className="flex justify-between border-b border-slate-50 pb-2">
                      <span className="text-slate-400 font-medium">{k}</span>
                      <span className="text-slate-800 font-semibold">{v}</span>
                    </div>
                  ))}
                  <div className="flex justify-between border-b border-slate-50 pb-2">
                    <span className="text-slate-400 font-medium">Status</span>
                    <StatusBadge status={viewDetail.status} />
                  </div>
                  <div className="pt-1">
                    <span className="text-slate-400 font-medium text-xs uppercase tracking-wide">Description</span>
                    <p className="mt-1.5 text-slate-700 leading-relaxed">{viewDetail.description}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}