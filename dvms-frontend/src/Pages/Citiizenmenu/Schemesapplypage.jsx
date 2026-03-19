import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";

// ─── Mock Schemes Data ───────────────────────────────────────────────────────
const SCHEMES = [
  {
    id: "pmay",
    title: "PM Awas Yojana",
    category: "Housing",
    description: "Affordable housing assistance for eligible rural families under the Pradhan Mantri Awas Yojana scheme.",
    eligibility: "BPL families, annual income < ₹3 Lakh",
    benefit: "Up to ₹1.2 Lakh",
    icon: "🏠",
    color: "from-blue-500 to-blue-700",
    bg: "bg-blue-50",
    border: "border-blue-200",
    text: "text-blue-700",
    tag: "bg-blue-100 text-blue-700",
    deadline: "31 Mar 2026",
  },
  {
    id: "pmkisan",
    title: "PM-KISAN Samman Nidhi",
    category: "Agriculture",
    description: "Income support of ₹6,000/year in three installments for small and marginal farmers.",
    eligibility: "Land-holding farmers, up to 2 hectares",
    benefit: "₹6,000 / Year",
    icon: "🌾",
    color: "from-emerald-500 to-green-700",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    text: "text-emerald-700",
    tag: "bg-emerald-100 text-emerald-700",
    deadline: "15 Apr 2026",
  },
  {
    id: "ujjwala",
    title: "Ujjwala Yojana",
    category: "Energy",
    description: "Free LPG connection to women from BPL households for clean cooking fuel access.",
    eligibility: "BPL women, no existing LPG connection",
    benefit: "Free LPG Connection",
    icon: "🔥",
    color: "from-orange-400 to-red-500",
    bg: "bg-orange-50",
    border: "border-orange-200",
    text: "text-orange-700",
    tag: "bg-orange-100 text-orange-700",
    deadline: "30 Apr 2026",
  },
  {
    id: "scholarship",
    title: "Post-Matric Scholarship",
    category: "Education",
    description: "Financial aid for SC/ST/OBC students pursuing post-matric education in recognised institutes.",
    eligibility: "SC/ST/OBC students, family income < ₹2.5 Lakh",
    benefit: "Up to ₹12,000 / Year",
    icon: "🎓",
    color: "from-violet-500 to-purple-700",
    bg: "bg-violet-50",
    border: "border-violet-200",
    text: "text-violet-700",
    tag: "bg-violet-100 text-violet-700",
    deadline: "20 May 2026",
  },
  {
    id: "atal",
    title: "Atal Pension Yojana",
    category: "Social Security",
    description: "Guaranteed pension scheme for unorganised sector workers between 18–40 years of age.",
    eligibility: "Age 18–40, bank account holder",
    benefit: "₹1,000 – ₹5,000 / Month",
    icon: "🛡️",
    color: "from-sky-500 to-cyan-700",
    bg: "bg-sky-50",
    border: "border-sky-200",
    text: "text-sky-700",
    tag: "bg-sky-100 text-sky-700",
    deadline: "Ongoing",
  },
  {
    id: "nrega",
    title: "MGNREGA Employment",
    category: "Employment",
    description: "100 days of guaranteed wage employment per year for every rural household.",
    eligibility: "Rural adult household members",
    benefit: "100 Days Guaranteed Work",
    icon: "⛏️",
    color: "from-amber-400 to-yellow-600",
    bg: "bg-amber-50",
    border: "border-amber-200",
    text: "text-amber-700",
    tag: "bg-amber-100 text-amber-700",
    deadline: "Ongoing",
  },
];

const CATEGORIES = ["All", "Housing", "Agriculture", "Energy", "Education", "Social Security", "Employment"];

// ─── Sub-components ───────────────────────────────────────────────────────────

function SchemeCard({ scheme, onApply }) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl border ${scheme.border} ${scheme.bg} p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md flex flex-col gap-3`}
    >
      {/* top accent strip */}
      <div className={`absolute top-0 left-0 h-1 w-full rounded-t-2xl bg-gradient-to-r ${scheme.color}`} />

      <div className="flex items-start justify-between">
        <span className="text-3xl select-none">{scheme.icon}</span>
        <span className={`rounded-full px-3 py-0.5 text-xs font-semibold ${scheme.tag}`}>
          {scheme.category}
        </span>
      </div>

      <div>
        <h3 className={`text-base font-extrabold ${scheme.text}`}>{scheme.title}</h3>
        <p className="mt-1 text-xs text-gray-500 leading-relaxed">{scheme.description}</p>
      </div>

      <div className="flex flex-col gap-1 text-xs text-gray-600">
        <span>
          <span className="font-semibold">Eligibility:</span> {scheme.eligibility}
        </span>
        <span>
          <span className="font-semibold">Benefit:</span>{" "}
          <span className={`font-bold ${scheme.text}`}>{scheme.benefit}</span>
        </span>
        <span>
          <span className="font-semibold">Deadline:</span> {scheme.deadline}
        </span>
      </div>

      <button
        onClick={() => onApply(scheme)}
        className={`mt-auto w-full rounded-xl bg-gradient-to-r ${scheme.color} py-2.5 text-sm font-bold text-white shadow-sm transition-all duration-150 hover:opacity-90 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2`}
      >
        Apply Now →
      </button>
    </div>
  );
}

function ApplyModal({ scheme, onClose, onSubmit }) {
  const { user } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    citizenId: user?.citizenId || "",
    phone: "",
    address: "",
    reason: "",
    declaration: false,
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = () => {
    if (!form.phone || !form.address || !form.reason || !form.declaration) {
      alert("Please fill all fields and accept the declaration.");
      return;
    }
    onSubmit({ scheme, form });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl flex flex-col items-center gap-4 text-center">
          <span className="text-5xl">🎉</span>
          <h2 className="text-xl font-extrabold text-emerald-700">Application Submitted!</h2>
          <p className="text-sm text-gray-500 leading-relaxed">
            Your application for <span className="font-bold text-gray-700">{scheme.title}</span> has been sent to the officer. You will be notified on status updates.
          </p>
          <button
            onClick={onClose}
            className="mt-2 rounded-xl bg-emerald-600 px-6 py-2.5 text-sm font-bold text-white hover:bg-emerald-700"
          >
            Back to Schemes
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className={`bg-gradient-to-r ${scheme.color} px-6 py-5 text-white`}>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-white/70">Apply for Scheme</p>
              <h2 className="mt-1 text-xl font-extrabold">{scheme.title}</h2>
              <p className="text-xs text-white/80 mt-1">Benefit: {scheme.benefit}</p>
            </div>
            <button onClick={onClose} className="text-white/70 hover:text-white text-xl leading-none">✕</button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4 max-h-[65vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500">Full Name</label>
              <input name="name" value={form.name} onChange={handleChange}
                className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400" readOnly />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500">Citizen ID</label>
              <input name="citizenId" value={form.citizenId} onChange={handleChange}
                className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400" readOnly />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-500">Email</label>
            <input name="email" value={form.email} onChange={handleChange}
              className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400" readOnly />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-500">Phone Number *</label>
            <input name="phone" value={form.phone} onChange={handleChange} placeholder="Enter your phone number"
              className="rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-500">Residential Address *</label>
            <textarea name="address" value={form.address} onChange={handleChange} rows={2} placeholder="Enter full address"
              className="rounded-xl border border-gray-200 px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-400" />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-500">Reason for Application *</label>
            <textarea name="reason" value={form.reason} onChange={handleChange} rows={3} placeholder="Briefly explain why you are applying for this scheme..."
              className="rounded-xl border border-gray-200 px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-400" />
          </div>

          <label className="flex items-start gap-2 cursor-pointer">
            <input type="checkbox" name="declaration" checked={form.declaration} onChange={handleChange} className="mt-0.5 accent-blue-600" />
            <span className="text-xs text-gray-500 leading-relaxed">
              I hereby declare that all information provided is accurate and I meet the eligibility criteria. I understand that false information may lead to rejection.
            </span>
          </label>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex gap-3">
          <button onClick={onClose}
            className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50">
            Cancel
          </button>
          <button onClick={handleSubmit}
            className={`flex-1 rounded-xl bg-gradient-to-r ${scheme.color} py-2.5 text-sm font-bold text-white hover:opacity-90`}>
            Submit Application →
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function SchemesApplyPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [selectedScheme, setSelectedScheme] = useState(null);

  const filtered = SCHEMES.filter((s) => {
    const matchCat = activeCategory === "All" || s.category === activeCategory;
    const matchSearch =
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.description.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleApply = (scheme) => setSelectedScheme(scheme);
  const handleModalClose = () => setSelectedScheme(null);
  const handleSubmit = (data) => {
    console.log("Scheme application submitted to officer:", data);
    // TODO: call your API here, e.g. submitSchemeApplication(data)
  };

  const handleLogout = () => { logout(); navigate("/login", { replace: true }); };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-blue-100 bg-white/80 px-6 py-3 shadow-sm backdrop-blur-md">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/citizen/dashboard")}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow"
          >
            <span className="text-lg">🏛️</span>
          </button>
          <div className="leading-tight">
            <p className="text-xs font-bold uppercase tracking-widest text-blue-700">DVMS</p>
            <p className="text-[10px] text-gray-400 tracking-wide">Digital Village Management System</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/citizen/dashboard")}
            className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-600 hover:bg-blue-100"
          >
            ← Dashboard
          </button>
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-sm font-bold text-white uppercase shadow">
            {user?.name?.charAt(0) ?? "C"}
          </div>
          <button
            onClick={handleLogout}
            className="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-100"
          >
            Logout
          </button>
        </div>
      </header>

      {/* ── Page Body ──────────────────────────────────────────────────── */}
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">

        {/* Page Banner */}
        <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-600 px-7 py-8 text-white shadow-lg">
          <span className="absolute -top-8 -right-8 h-40 w-40 rounded-full bg-white/10" />
          <span className="absolute -bottom-6 right-24 h-24 w-24 rounded-full bg-white/10" />
          <div className="relative">
            <p className="text-sm font-semibold text-blue-200 uppercase tracking-widest">Government Welfare</p>
            <h1 className="mt-1 text-3xl font-extrabold tracking-tight">Browse & Apply for Schemes</h1>
            <p className="mt-2 text-sm text-blue-200 max-w-md leading-relaxed">
              Explore available government welfare schemes and submit your application directly to the officer.
            </p>
            <div className="mt-4 text-xs">
              <span className="rounded-full bg-white/20 px-3 py-1">
                📋 {SCHEMES.length} Schemes Available
              </span>
            </div>
          </div>
        </section>

        {/* Search + Filters */}
        <section className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="🔍  Search schemes..."
            className="w-full sm:max-w-xs rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`rounded-full px-3 py-1 text-xs font-semibold transition-all ${
                  activeCategory === cat
                    ? "bg-blue-600 text-white shadow"
                    : "bg-white border border-gray-200 text-gray-600 hover:bg-blue-50"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>

        {/* Schemes Grid */}
        <section>
          <h2 className="mb-4 text-xs font-bold uppercase tracking-widest text-gray-500">
            {filtered.length} Scheme{filtered.length !== 1 ? "s" : ""} Found
          </h2>
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
              <span className="text-5xl mb-3">🔍</span>
              <p className="text-sm font-medium">No schemes match your search.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((scheme) => (
                <SchemeCard key={scheme.id} scheme={scheme} onApply={handleApply} />
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Apply Modal */}
      {selectedScheme && (
        <ApplyModal
          scheme={selectedScheme}
          onClose={handleModalClose}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}