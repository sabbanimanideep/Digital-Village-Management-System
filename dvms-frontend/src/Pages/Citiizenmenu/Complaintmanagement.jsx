import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";

import { getComplaints, submitComplaint } from "../../Services/complaintService";


// ─── Constants ────────────────────────────────────────────────────────────────

const CATEGORIES = [
  { id: "water",       label: "Water Supply",         icon: "💧" },
  { id: "road",        label: "Road & Infrastructure", icon: "🛣️" },
  { id: "electricity", label: "Electricity",           icon: "⚡" },
  { id: "sanitation",  label: "Sanitation & Waste",    icon: "🗑️" },
  { id: "health",      label: "Health Services",       icon: "🏥" },
  { id: "education",   label: "Education",             icon: "📚" },
  { id: "land",        label: "Land & Property",       icon: "🏡" },
  { id: "other",       label: "Other",                 icon: "📌" },
];

const PRIORITIES = [
  { id: "low",    label: "Low",    color: "text-emerald-600 bg-emerald-50 border-emerald-200" },
  { id: "medium", label: "Medium", color: "text-amber-600 bg-amber-50 border-amber-200" },
  { id: "high",   label: "High",   color: "text-red-600 bg-red-50 border-red-200" },
];

const STATUS_CONFIG = {
  "Pending":     { dot: "bg-amber-400",   badge: "bg-amber-50 text-amber-700 border border-amber-200" },
  "In Progress": { dot: "bg-blue-500",    badge: "bg-blue-50 text-blue-700 border border-blue-200" },
  "Resolved":    { dot: "bg-emerald-500", badge: "bg-emerald-50 text-emerald-700 border border-emerald-200" },
  "Rejected":    { dot: "bg-red-400",     badge: "bg-red-50 text-red-700 border border-red-200" },
};



const INITIAL_FORM = {
  category: "", priority: "medium", subject: "", description: "", location: "", files: [],
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG["Pending"];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-0.5 text-xs font-semibold ${cfg.badge}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
      {status}
    </span>
  );
}

function ComplaintCard({ complaint, onExpand, isExpanded }) {
  const priorityColors = {
    High:   "text-red-600 bg-red-50 border-red-200",
    Medium: "text-amber-600 bg-amber-50 border-amber-200",
    Low:    "text-emerald-600 bg-emerald-50 border-emerald-200",
  };
  return (
    <div className={`rounded-2xl border bg-white shadow-sm transition-all duration-200 ${isExpanded ? "border-orange-300 ring-2 ring-orange-100" : "border-gray-200 hover:border-orange-200 hover:shadow-md"}`}>
      <div className="flex cursor-pointer items-start justify-between gap-4 p-5" onClick={() => onExpand(complaint.id)}>
        <div className="flex items-start gap-3 min-w-0">
          <span className="text-2xl shrink-0 mt-0.5">{complaint.categoryIcon}</span>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="text-xs font-mono font-bold text-gray-400">{complaint.id}</span>
              <StatusBadge status={complaint.status} />
              <span className={`text-xs font-semibold border rounded-full px-2 py-0.5 ${priorityColors[complaint.priority]}`}>
                {complaint.priority}
              </span>
            </div>
            <p className="text-sm font-semibold text-gray-800">{complaint.category}</p>
            <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{complaint.description}</p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2 shrink-0">
          <span className="text-xs text-gray-400">{complaint.date}</span>
          {complaint.attachments > 0 && <span className="text-xs text-gray-400">📎 {complaint.attachments}</span>}
          <svg className={`h-4 w-4 text-gray-400 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {isExpanded && (
        <div className="border-t border-gray-100 px-5 pb-5 pt-4">
          <p className="text-sm text-gray-700 leading-relaxed mb-4">{complaint.description}</p>
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Status Timeline</p>
          <ol className="relative border-l-2 border-orange-100 ml-2 space-y-4">
            {complaint.updates.map((u, i) => (
              <li key={i} className="ml-5">
                <span className="absolute -left-[9px] flex h-4 w-4 items-center justify-center rounded-full bg-orange-500 ring-4 ring-white">
                  <span className="h-1.5 w-1.5 rounded-full bg-white" />
                </span>
                <p className="text-xs font-semibold text-gray-700">{u.note}</p>
                <p className="text-xs text-gray-400 mt-0.5">{u.date} · {u.by}</p>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}

function Field({ label, required, error, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-bold uppercase tracking-widest text-gray-500">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-red-500">⚠ {error}</p>}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ComplaintManagement() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const displayUser = user ?? { name: "Citizen", citizenId: "N/A", village: "Gram Panchayat" };

  const [activeTab,    setActiveTab]    = useState("new");
  const [form,         setForm]         = useState(INITIAL_FORM);
  const [errors,       setErrors]       = useState({});
  const [submitting,   setSubmitting]   = useState(false);
  const [submitted,    setSubmitted]    = useState(false);
  const [submittedId,  setSubmittedId]  = useState("");
  const [expandedId,   setExpandedId]   = useState(null);
  const [filterStatus, setFilterStatus] = useState("All");
  const [dragOver,     setDragOver]     = useState(false);
  const fileInputRef = useRef(null);
  const [complaints, setComplaints] = useState([]);

useEffect(() => {
  const fetchComplaints = async () => {
    try {
      const data = await getComplaints(user?.email);
      console.log("Fetched data:", data); // ✅ ADD
      setComplaints(data);
    } catch (err) {
      console.error(err);
    }
  };

  if (user?.email) {
    fetchComplaints();
  }
}, [user]);
  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.category)                           e.category    = "Please select a category.";
    if (!form.subject.trim())                     e.subject     = "Subject is required.";
    else if (form.subject.trim().length < 10)     e.subject     = "Minimum 10 characters.";
    if (!form.description.trim())                 e.description = "Description is required.";
    else if (form.description.trim().length < 30) e.description = "Minimum 30 characters.";
    if (!form.location.trim())                    e.location    = "Location is required.";
    return e;
  };

const handleSubmit = async (evt) => {
  evt.preventDefault();

  console.log("🔥 Submit button clicked");

  const errs = validate();
  if (Object.keys(errs).length > 0) {
    console.log("Validation errors:", errs);
    setErrors(errs);
    return;
  }

  setSubmitting(true);

  try {
    const payload = {
      userEmail: user?.email,
      category: form.category,
      priority: form.priority,
      subject: form.subject,
      description: form.description,
      location: form.location,
    };

    console.log("📦 Payload:", payload);

    const res = await submitComplaint(payload);

    console.log("✅ Response:", res);

    setSubmittedId(res.complaintId);
    setSubmitted(true);
  } catch (err) {
    console.error("❌ Submit error:", err);
    alert("Submission failed");
  } finally {
    setSubmitting(false);
  }
};

  const handleReset = () => {
    setForm(INITIAL_FORM);
    setErrors({});
    setSubmitted(false);
    setSubmittedId("");
  };

  const addFiles = useCallback((newFiles) => {
    const allowed = Array.from(newFiles).filter(f => {
      const ext = f.name.split(".").pop().toLowerCase();
      return ["jpg","jpeg","png","pdf","doc","docx"].includes(ext) && f.size < 5 * 1024 * 1024;
    });
    setForm(prev => ({ ...prev, files: [...prev.files, ...allowed].slice(0, 5) }));
  }, []);

  const removeFile = (i) => setForm(prev => ({ ...prev, files: prev.files.filter((_, idx) => idx !== i) }));

  const handleDrop = (evt) => {
    evt.preventDefault();
    setDragOver(false);
    addFiles(evt.dataTransfer.files);
  };

const filtered = filterStatus === "All"
  ? complaints
  : complaints.filter(c => c.status === filterStatus);

  const handleExpand = (id) => setExpandedId(prev => prev === id ? null : id);
  const mappedComplaints = filtered.map(c => ({
  id: c.complaintId,
  category: c.category,
  categoryIcon: "📌",
  description: c.description,
  priority: c.priority?.charAt(0).toUpperCase() + c.priority?.slice(1),
  status: c.status,
  date: new Date(c.createdAt).toLocaleDateString(),
  attachments: 0,
  updates: [],
}));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-red-50/30 to-orange-50/20">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-20 border-b border-gray-200 bg-white/90 backdrop-blur-md shadow-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate("/citizen/dashboard")}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition"
              aria-label="Back to Dashboard">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div>
              <h1 className="text-base font-extrabold text-gray-900 leading-tight">Complaint Management</h1>
              <p className="text-xs text-gray-400">Digital Village Management System</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-red-600 text-xs font-bold text-white uppercase shadow">
              {displayUser.name?.charAt(0) ?? "C"}
            </div>
            <span className="hidden sm:block text-sm font-semibold text-gray-700">{displayUser.name}</span>
          </div>
        </div>

        {/* Tab bar */}
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="flex gap-1 border-t border-gray-100">
            {[{ id: "new", label: "📝 New Complaint" }, { id: "history", label: "📋 My Complaints" }].map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`relative px-5 py-3 text-sm font-semibold transition-colors ${activeTab === tab.id ? "text-orange-600" : "text-gray-500 hover:text-gray-700"}`}>
                {tab.label}
                {activeTab === tab.id && <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-t-full bg-orange-500" />}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">

        {/* ══ TAB: NEW COMPLAINT ══════════════════════════════════════════════ */}
        {activeTab === "new" && (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

            {/* Form */}
            <div className="lg:col-span-2">
              {submitted ? (
                /* Success state */
                <div className="flex flex-col items-center rounded-2xl border border-emerald-200 bg-emerald-50 px-8 py-16 text-center shadow-sm">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-4xl mb-4">✅</div>
                  <h2 className="text-2xl font-extrabold text-emerald-800 mb-1">Complaint Registered!</h2>
                  <p className="text-sm text-emerald-700 mb-4">Your complaint has been submitted and is under review.</p>
                  <div className="rounded-xl border border-emerald-300 bg-white px-6 py-3 mb-6 shadow-sm">
                    <p className="text-xs text-gray-400 font-semibold uppercase tracking-widest mb-1">Complaint ID</p>
                    <p className="text-xl font-mono font-bold text-emerald-700">{submittedId}</p>
                  </div>
                  <div className="flex flex-wrap gap-3 justify-center">
                    <button onClick={handleReset}
                      className="rounded-xl bg-orange-600 px-6 py-2.5 text-sm font-bold text-white hover:bg-orange-700 shadow transition">
                      + Register Another
                    </button>
                    <button onClick={() => setActiveTab("history")}
                      className="rounded-xl border border-gray-300 bg-white px-6 py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-50 shadow transition">
                      View My Complaints →
                    </button>
                  </div>
                </div>
              ) : (
                /* Form */
                <form onSubmit={handleSubmit} noValidate className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm space-y-6">
                  <div>
                    <h2 className="text-lg font-extrabold text-gray-900">Register New Complaint</h2>
                    <p className="text-xs text-gray-400 mt-0.5">Fields marked <span className="text-red-500">*</span> are required.</p>
                  </div>

                  {/* Category */}
                  <Field label="Complaint Category" required error={errors.category}>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {CATEGORIES.map(cat => (
                        <button type="button" key={cat.id} onClick={() => handleChange("category", cat.id)}
                          className={`flex flex-col items-center gap-1 rounded-xl border-2 p-3 text-xs font-semibold transition-all ${
                            form.category === cat.id
                              ? "border-orange-500 bg-orange-50 text-orange-700 shadow"
                              : "border-gray-200 bg-gray-50 text-gray-600 hover:border-orange-300"
                          }`}>
                          <span className="text-xl">{cat.icon}</span>
                          <span className="leading-tight text-center">{cat.label}</span>
                        </button>
                      ))}
                    </div>
                  </Field>

                  {/* Priority */}
                  <Field label="Priority Level" required>
                    <div className="flex gap-2">
                      {PRIORITIES.map(p => (
                        <button type="button" key={p.id} onClick={() => handleChange("priority", p.id)}
                          className={`rounded-full border-2 px-4 py-1.5 text-xs font-bold transition-all ${
                            form.priority === p.id
                              ? p.color + " border-current shadow"
                              : "border-gray-200 text-gray-500 hover:border-gray-300"
                          }`}>
                          {p.label}
                        </button>
                      ))}
                    </div>
                  </Field>

                  {/* Subject */}
                  <Field label="Subject" required error={errors.subject}>
                    <input type="text" value={form.subject}
                      onChange={e => handleChange("subject", e.target.value)}
                      placeholder="Brief title for your complaint…" maxLength={100}
                      className={`w-full rounded-xl border px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 outline-none transition focus:ring-2 focus:ring-orange-400 ${
                        errors.subject ? "border-red-400 bg-red-50" : "border-gray-300 bg-gray-50 focus:border-orange-400"
                      }`} />
                    <p className="text-right text-xs text-gray-400">{form.subject.length}/100</p>
                  </Field>

                  {/* Description */}
                  <Field label="Description" required error={errors.description}>
                    <textarea rows={5} value={form.description}
                      onChange={e => handleChange("description", e.target.value)}
                      placeholder="Describe the issue — what happened, when it started, how it affects you…"
                      maxLength={1000}
                      className={`w-full rounded-xl border px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 outline-none resize-none transition focus:ring-2 focus:ring-orange-400 ${
                        errors.description ? "border-red-400 bg-red-50" : "border-gray-300 bg-gray-50 focus:border-orange-400"
                      }`} />
                    <p className="text-right text-xs text-gray-400">{form.description.length}/1000</p>
                  </Field>

                  {/* Location */}
                  <Field label="Location / Address" required error={errors.location}>
                    <input type="text" value={form.location}
                      onChange={e => handleChange("location", e.target.value)}
                      placeholder="Ward no., street, landmark…"
                      className={`w-full rounded-xl border px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 outline-none transition focus:ring-2 focus:ring-orange-400 ${
                        errors.location ? "border-red-400 bg-red-50" : "border-gray-300 bg-gray-50 focus:border-orange-400"
                      }`} />
                  </Field>

                  {/* File Upload */}
                  <Field label="Attachments (optional)">
                    <div
                      onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                      onDragLeave={() => setDragOver(false)}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className={`cursor-pointer rounded-xl border-2 border-dashed px-6 py-8 text-center transition-all ${
                        dragOver ? "border-orange-400 bg-orange-50" : "border-gray-300 bg-gray-50 hover:border-orange-300 hover:bg-orange-50/50"
                      }`}>
                      <p className="text-3xl mb-2">📎</p>
                      <p className="text-sm font-semibold text-gray-600">Drag & drop or click to browse</p>
                      <p className="text-xs text-gray-400 mt-1">JPG, PNG, PDF, DOC · max 5 MB · up to 5 files</p>
                      <input ref={fileInputRef} type="file" multiple
                        accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
                        className="hidden"
                        onChange={e => addFiles(e.target.files)} />
                    </div>

                    {form.files.length > 0 && (
                      <ul className="mt-3 space-y-2">
                        {form.files.map((file, i) => (
                          <li key={i} className="flex items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-2 shadow-sm">
                            <div className="flex items-center gap-2 min-w-0">
                              <span>{file.name.match(/\.(jpg|jpeg|png)$/i) ? "🖼️" : file.name.endsWith(".pdf") ? "📄" : "📝"}</span>
                              <span className="truncate text-xs text-gray-700">{file.name}</span>
                              <span className="text-xs text-gray-400 shrink-0">({(file.size / 1024).toFixed(0)} KB)</span>
                            </div>
                            <button type="button" onClick={() => removeFile(i)}
                              className="ml-3 rounded-full p-1 text-gray-400 hover:bg-red-50 hover:text-red-500 transition">✕</button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </Field>

                  {/* Submit / Reset */}
                  <div className="flex flex-wrap gap-3 pt-2">
                    <button type="submit" disabled={submitting}
                      className="flex-1 sm:flex-none rounded-xl bg-gradient-to-r from-orange-500 to-red-600 px-8 py-3 text-sm font-extrabold text-white shadow-md hover:from-orange-600 hover:to-red-700 hover:shadow-lg disabled:opacity-60 transition focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2">
                      {submitting ? (
                        <span className="flex items-center gap-2 justify-center">
                          <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                          </svg>
                          Submitting…
                        </span>
                      ) : "📤 Submit Complaint"}
                    </button>
                    <button type="button" onClick={handleReset}
                      className="rounded-xl border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition">
                      Reset
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-4">

              {/* Summary */}
              <div className="rounded-2xl border border-orange-200 bg-gradient-to-br from-orange-50 to-red-50 p-5 shadow-sm">
                <p className="text-xs font-bold uppercase tracking-widest text-orange-700 mb-3">📊 My Summary</p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "Total Filed",  value: complaints.length,                                        color: "text-gray-800"    },
                    { label: "Pending",      value: complaints.filter(c => c.status === "Pending").length,    color: "text-amber-600"   },
                    { label: "In Progress",  value: complaints.filter(c => c.status === "In Progress").length,color: "text-blue-600"    },
                    { label: "Resolved",     value: complaints.filter(c => c.status === "Resolved").length,   color: "text-emerald-600" },
                  ].map(s => (
                    <div key={s.label} className="rounded-xl bg-white/70 p-3 text-center border border-white/80 shadow-sm">
                      <p className={`text-2xl font-extrabold ${s.color}`}>{s.value}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tips */}
              <div className="rounded-2xl border border-blue-200 bg-blue-50 p-5 shadow-sm">
                <p className="text-xs font-bold uppercase tracking-widest text-blue-700 mb-3">💡 Filing Tips</p>
                <ul className="space-y-2 text-xs text-gray-700 leading-relaxed">
                  {[
                    "Be specific — mention exact location and dates.",
                    "Attach photos to speed up resolution.",
                    "Select the correct category for faster routing.",
                    "Check history for existing similar reports.",
                  ].map((tip, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="text-blue-500 font-bold shrink-0">{i + 1}.</span>{tip}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Helpline */}
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 shadow-sm">
                <p className="text-xs font-bold uppercase tracking-widest text-emerald-700 mb-1">🆘 Helpline</p>
                <p className="text-xl font-extrabold text-emerald-700">1800-XXX-XXXX</p>
                <p className="text-xs text-gray-500">Mon–Sat · 9 AM – 5 PM</p>
              </div>

            </div>
          </div>
        )}

        {/* ══ TAB: COMPLAINT HISTORY ══════════════════════════════════════════ */}
        {activeTab === "history" && (
          <div className="space-y-5">

            {/* Filter bar */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-extrabold text-gray-900">My Complaints</h2>
                <p className="text-xs text-gray-400">{filtered.length} complaint(s) found</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {["All", "Pending", "In Progress", "Resolved"].map(s => (
                  <button key={s} onClick={() => setFilterStatus(s)}
                    className={`rounded-full border px-4 py-1.5 text-xs font-semibold transition-all ${
                      filterStatus === s
                        ? "border-orange-500 bg-orange-500 text-white shadow"
                        : "border-gray-300 bg-white text-gray-600 hover:border-orange-300 hover:text-orange-600"
                    }`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {filtered.length === 0 ? (
              <div className="flex flex-col items-center rounded-2xl border border-dashed border-gray-300 bg-white py-20 text-center">
                <p className="text-5xl mb-3">🗂️</p>
                <p className="text-sm font-semibold text-gray-600">No complaints found</p>
                <button onClick={() => setActiveTab("new")}
                  className="mt-5 rounded-xl bg-orange-600 px-5 py-2 text-sm font-bold text-white hover:bg-orange-700 shadow transition">
                  + New Complaint
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {mappedComplaints.map(complaint => (
                  <ComplaintCard
                    key={complaint.id}
                    complaint={complaint}
                    onExpand={handleExpand}
                    isExpanded={expandedId === complaint.id}
                  />
                ))}
              </div>
            )}

            <div className="flex justify-center pt-2">
              <button onClick={() => setActiveTab("new")}
                className="rounded-xl bg-linear-to-r from-orange-500 to-red-600 px-8 py-3 text-sm font-extrabold text-white shadow-md hover:shadow-lg transition hover:from-orange-600 hover:to-red-700">
                📝 Register New Complaint
              </button>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}