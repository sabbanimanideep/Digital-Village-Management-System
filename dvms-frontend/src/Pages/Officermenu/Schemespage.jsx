// Pages/OfficerPages/SchemesPage.jsx
import {
  BookOpen, Calendar, ClipboardList, ExternalLink,
  Eye, Link2, PlusCircle, RefreshCw,
  ThumbsDown, ThumbsUp, Trash2, X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserApplications } from "../../Services/applicationService";
import { addScheme, getAllSchemes } from "../../Services/schemeService";
const CATEGORY_COLOR = {
  "Housing":           "bg-amber-100 text-amber-700",
  "Agriculture":       "bg-emerald-100 text-emerald-700",
  "Water & Sanitation":"bg-blue-100 text-blue-700",
  "General":           "bg-violet-100 text-violet-700",
};

const APP_STATUS_CFG = {
  "Pending":  "bg-amber-50 text-amber-700 border-amber-200",
  "Approved": "bg-emerald-50 text-emerald-700 border-emerald-200",
  "Rejected": "bg-rose-50 text-rose-700 border-rose-200",
};

export default function SchemesPage() {
  const navigate = useNavigate();
  const quickNavigate = (path) => navigate(path);

  const [subPage,      setSubPage]      = useState("schemes");
  const [schemes,      setSchemes]      = useState([]);
  const [applications, setApplications] = useState([]);
  const [viewApp,      setViewApp]      = useState(null);
  const [form,         setForm]         = useState({ title: "", description: "", link: "", category: "" });
  const [formError,    setFormError]    = useState("");
  const [loading,      setLoading]      = useState(true);

  useEffect(() => {
    fetchSchemes();
    fetchApplications();
  }, []);

  const fetchSchemes = async () => {
  try {
    setLoading(true);
    setError("");

    const data = await getAllSchemes();

    // ✅ safety check
    if (!Array.isArray(data)) {
      throw new Error("Invalid response format");
    }

    setSchemes(data);

  } catch (err) {
    console.error("Failed to fetch schemes:", err);
    setError("Unable to load schemes. Please try again.");
  } finally {
    setLoading(false);
  }
};
  const fetchApplications = async () => {
    try {
      const data = await getUserApplications();
      setApplications(data);
    } catch (err) {
      console.error("Failed to fetch applications:", err);
    }
  };

  const pendingCount  = applications.filter(a => a.status === "Pending").length;
  const approvedCount = applications.filter(a => a.status === "Approved").length;
  const rejectedCount = applications.filter(a => a.status === "Rejected").length;

  const postScheme = async () => {
    if (!form.title.trim() || !form.description.trim() || !form.link.trim()) {
      setFormError("Title, description, and application link are required.");
      return;
    }
    setFormError("");
    try {
      const newScheme = {
        title:       form.title.trim(),
        description: form.description.trim(),
        link:        form.link.trim().startsWith("http") ? form.link.trim() : `https://${form.link.trim()}`,
        category:    form.category || "General",
        posted:      new Date().toISOString().split("T")[0],
      };
      const created = await addScheme(newScheme);
      setSchemes(prev => [created, ...prev]);
      setForm({ title: "", description: "", link: "", category: "" });
    } catch (err) {
      setFormError("Failed to publish scheme. Please try again.");
      console.error(err);
    }
  };

  const deleteScheme = id => setSchemes(prev => prev.filter(s => s.id !== id));

  const updateAppStatus = (id, status) => {
    setApplications(prev => prev.map(a => a.id === id ? { ...a, status } : a));
    setViewApp(prev => prev?.id === id ? { ...prev, status } : prev);
  };

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
            <h2 className="text-xl font-black text-slate-900">Government Schemes</h2>
            <p className="text-slate-400 text-xs">Publish schemes and review citizen applications</p>
          </div>
          <button
            onClick={() => quickNavigate("/officer/dashboard")}
            className="text-sm text-slate-500 hover:text-blue-600 font-medium transition-colors"
          >
            ← Back to Dashboard
          </button>
        </header>

        <main className="flex-1 overflow-y-auto p-6 space-y-5">

          {/* Sub-page toggle */}
          <div className="flex gap-2 bg-white border border-slate-100 shadow-sm rounded-2xl p-1.5 w-fit">
            <button onClick={() => setSubPage("schemes")}
              className={`px-5 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2
                ${subPage === "schemes" ? "bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow" : "text-slate-500 hover:text-slate-700"}`}>
              <BookOpen className="w-4 h-4" /> Schemes
            </button>
            <button onClick={() => setSubPage("applications")}
              className={`px-5 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2
                ${subPage === "applications" ? "bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow" : "text-slate-500 hover:text-slate-700"}`}>
              <ClipboardList className="w-4 h-4" /> Applications
              {pendingCount > 0 && (
                <span className="bg-amber-500 text-white text-[10px] font-black rounded-full px-1.5 py-0.5 leading-none">{pendingCount}</span>
              )}
            </button>
          </div>

          {/* ── SCHEMES ── */}
          {subPage === "schemes" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Form */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                  <h3 className="text-slate-800 font-bold text-base mb-5 flex items-center gap-2">
                    <PlusCircle className="w-4 h-4 text-blue-500" /> Post New Scheme
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 block">Scheme Title *</label>
                      <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                        placeholder="e.g. PM Awas Yojana"
                        className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 block">Description *</label>
                      <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                        placeholder="Brief description of the scheme…" rows={4}
                        className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 resize-none" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 block">Application Link *</label>
                      <div className="relative">
                        <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input value={form.link} onChange={e => setForm(f => ({ ...f, link: e.target.value }))}
                          placeholder="https://scheme.gov.in"
                          className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400" />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 block">Category</label>
                      <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                        className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none bg-white">
                        <option value="">Select category…</option>
                        <option>Housing</option><option>Agriculture</option><option>Water & Sanitation</option><option>General</option>
                      </select>
                    </div>
                    {formError && <p className="text-xs text-rose-600 bg-rose-50 border border-rose-200 rounded-xl px-3 py-2">{formError}</p>}
                    <button onClick={postScheme}
                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 text-white text-sm font-bold hover:opacity-90 transition-opacity shadow flex items-center justify-center gap-2">
                      <PlusCircle className="w-4 h-4" /> Publish Scheme
                    </button>
                  </div>
                </div>
              </div>

              {/* Scheme Cards */}
              <div className="lg:col-span-2 space-y-4">
                {loading ? (
                  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-12 text-center text-slate-400 text-sm">Loading schemes...</div>
                ) : schemes.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-12 text-center text-slate-400 text-sm">No schemes posted yet.</div>
                ) : schemes.map(s => (
                  <div key={s.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 hover:shadow-md transition-shadow group">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                          <span className="font-mono text-xs font-bold text-violet-600 bg-violet-50 px-2 py-0.5 rounded-md">{s.id}</span>
                          {s.category && <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${CATEGORY_COLOR[s.category] || "bg-violet-100 text-violet-700"}`}>{s.category}</span>}
                        </div>
                        <h4 className="text-slate-800 font-bold text-base leading-snug">{s.title}</h4>
                      </div>
                      <button onClick={() => deleteScheme(s.id)}
                        className="p-1.5 rounded-lg text-slate-300 hover:text-rose-500 hover:bg-rose-50 transition-colors opacity-0 group-hover:opacity-100 flex-shrink-0">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-slate-600 text-sm leading-relaxed mb-4">{s.description}</p>
                    <div className="flex items-center justify-between flex-wrap gap-3 pt-3 border-t border-slate-50">
                      <div className="flex items-center gap-1.5 text-xs text-slate-400">
                        <Calendar className="w-3.5 h-3.5" /> Posted {s.posted}
                      </div>
                      <a href={s.link} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 hover:opacity-90 text-white text-xs font-bold transition-opacity shadow-sm">
                        <ExternalLink className="w-3.5 h-3.5" /> Apply Now
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── APPLICATIONS ── */}
          {subPage === "applications" && (
            <>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: "Pending Review", count: pendingCount,  color: "from-amber-500 to-orange-500" },
                  { label: "Approved",       count: approvedCount, color: "from-emerald-500 to-teal-500"  },
                  { label: "Rejected",       count: rejectedCount, color: "from-rose-500 to-pink-500"     },
                ].map(({ label, count, color }) => (
                  <div key={label} className={`bg-gradient-to-br ${color} rounded-2xl p-5 text-white shadow-md`}>
                    <div className="text-3xl font-black mb-1">{count}</div>
                    <div className="text-white/80 text-sm font-medium">{label}</div>
                  </div>
                ))}
              </div>

              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100">
                        {["App ID", "Applicant", "Scheme", "Applied On", "Status", "Actions"].map(h => (
                          <th key={h} className="text-left px-5 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {applications.map(a => (
                        <tr key={a.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="px-5 py-3.5"><span className="font-mono text-xs font-bold text-violet-600 bg-violet-50 px-2 py-1 rounded-lg">{a.id}</span></td>
                          <td className="px-5 py-3.5">
                            <div className="font-semibold text-slate-800 text-sm">{a.applicant}</div>
                            <div className="text-xs text-slate-400">{a.email}</div>
                          </td>
                          <td className="px-5 py-3.5 text-slate-600 text-xs max-w-[180px] truncate font-medium">{a.schemeName}</td>
                          <td className="px-5 py-3.5 text-xs text-slate-400 whitespace-nowrap">{a.appliedOn}</td>
                          <td className="px-5 py-3.5">
                            <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${APP_STATUS_CFG[a.status]}`}>{a.status}</span>
                          </td>
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-2 flex-wrap">
                              {a.status === "Pending" ? (
                                <>
                                  <button onClick={() => updateAppStatus(a.id, "Approved")}
                                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs font-bold transition-colors border border-emerald-200">
                                    <ThumbsUp className="w-3.5 h-3.5" /> Approve
                                  </button>
                                  <button onClick={() => updateAppStatus(a.id, "Rejected")}
                                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 text-xs font-bold transition-colors border border-rose-200">
                                    <ThumbsDown className="w-3.5 h-3.5" /> Reject
                                  </button>
                                </>
                              ) : (
                                <button onClick={() => updateAppStatus(a.id, "Pending")}
                                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-100 text-slate-500 hover:bg-slate-200 text-xs font-semibold transition-colors">
                                  <RefreshCw className="w-3 h-3" /> Reset
                                </button>
                              )}
                              <button onClick={() => setViewApp(a)}
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

              {/* Application Detail Modal */}
              {viewApp && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setViewApp(null)}>
                  <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6" onClick={e => e.stopPropagation()}>
                    <div className="flex items-center justify-between mb-5">
                      <span className="font-bold text-slate-800">Application Details</span>
                      <button onClick={() => setViewApp(null)} className="p-1.5 rounded-lg hover:bg-slate-100"><X className="w-4 h-4" /></button>
                    </div>
                    <div className="space-y-3 text-sm">
                      {[["Application ID", viewApp.id], ["Applicant", viewApp.applicant], ["Email", viewApp.email], ["Scheme", viewApp.schemeName], ["Applied On", viewApp.appliedOn]].map(([k, v]) => (
                        <div key={k} className="flex justify-between border-b border-slate-50 pb-2 gap-3">
                          <span className="text-slate-400 font-medium flex-shrink-0">{k}</span>
                          <span className="text-slate-800 font-semibold text-right">{v}</span>
                        </div>
                      ))}
                      <div className="flex justify-between pt-1">
                        <span className="text-slate-400 font-medium">Status</span>
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${APP_STATUS_CFG[viewApp.status]}`}>{viewApp.status}</span>
                      </div>
                    </div>
                    {viewApp.status === "Pending" && (
                      <div className="flex gap-2 mt-5">
                        <button onClick={() => { updateAppStatus(viewApp.id, "Approved"); setViewApp(null); }}
                          className="flex-1 py-2 rounded-xl bg-emerald-500 text-white text-sm font-bold hover:bg-emerald-600 transition-colors flex items-center justify-center gap-2">
                          <ThumbsUp className="w-4 h-4" /> Approve
                        </button>
                        <button onClick={() => { updateAppStatus(viewApp.id, "Rejected"); setViewApp(null); }}
                          className="flex-1 py-2 rounded-xl bg-rose-500 text-white text-sm font-bold hover:bg-rose-600 transition-colors flex items-center justify-center gap-2">
                          <ThumbsDown className="w-4 h-4" /> Reject
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </>
          )}

        </main>
      </div>
    </div>
  );
}