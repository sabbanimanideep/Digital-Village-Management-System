import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";

// TODO: replace with your real API call
// import { submitServiceRequest } from "../Services/serviceService";

// ─── Service Categories ───────────────────────────────────────────────────────
const SERVICE_TYPES = [
  {
    id: "road",
    label: "Road Repair",
    icon: "🛣️",
    desc: "Pothole, broken road, or damaged pathway",
    color: "from-slate-500 to-slate-700",
    bg: "bg-slate-50",
    border: "border-slate-200",
    text: "text-slate-700",
    tag: "bg-slate-100 text-slate-700",
    ring: "focus:ring-slate-400",
  },
  {
    id: "water",
    label: "Water Supply",
    icon: "💧",
    desc: "Water shortage, pipeline leak, or contamination",
    color: "from-sky-500 to-cyan-700",
    bg: "bg-sky-50",
    border: "border-sky-200",
    text: "text-sky-700",
    tag: "bg-sky-100 text-sky-700",
    ring: "focus:ring-sky-400",
  },
  {
    id: "electricity",
    label: "Electricity",
    icon: "⚡",
    desc: "Street light, power outage, or wiring issues",
    color: "from-amber-400 to-yellow-600",
    bg: "bg-amber-50",
    border: "border-amber-200",
    text: "text-amber-700",
    tag: "bg-amber-100 text-amber-700",
    ring: "focus:ring-amber-400",
  },
  {
    id: "sanitation",
    label: "Sanitation",
    icon: "🧹",
    desc: "Garbage collection, drainage, or cleaning request",
    color: "from-emerald-500 to-green-700",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    text: "text-emerald-700",
    tag: "bg-emerald-100 text-emerald-700",
    ring: "focus:ring-emerald-400",
  },
  {
    id: "health",
    label: "Health Services",
    icon: "🏥",
    desc: "Medical camp, health worker visit, or medicines",
    color: "from-rose-500 to-red-700",
    bg: "bg-rose-50",
    border: "border-rose-200",
    text: "text-rose-700",
    tag: "bg-rose-100 text-rose-700",
    ring: "focus:ring-rose-400",
  },
  {
    id: "education",
    label: "Education",
    icon: "🎒",
    desc: "School infrastructure, teacher, or enrollment support",
    color: "from-violet-500 to-purple-700",
    bg: "bg-violet-50",
    border: "border-violet-200",
    text: "text-violet-700",
    tag: "bg-violet-100 text-violet-700",
    ring: "focus:ring-violet-400",
  },
  {
    id: "agriculture",
    label: "Agriculture",
    icon: "🌾",
    desc: "Irrigation, crop issues, or fertilizer support",
    color: "from-lime-500 to-green-600",
    bg: "bg-lime-50",
    border: "border-lime-200",
    text: "text-lime-700",
    tag: "bg-lime-100 text-lime-700",
    ring: "focus:ring-lime-400",
  },
  {
    id: "other",
    label: "Other",
    icon: "📌",
    desc: "Any other civic service request",
    color: "from-gray-400 to-gray-600",
    bg: "bg-gray-50",
    border: "border-gray-200",
    text: "text-gray-700",
    tag: "bg-gray-100 text-gray-700",
    ring: "focus:ring-gray-400",
  },
];

const PRIORITY_LEVELS = [
  { value: "Low", label: "🟢 Low", desc: "Non-urgent, can wait a few days" },
  { value: "Medium", label: "🟡 Medium", desc: "Needs attention within a week" },
  { value: "High", label: "🔴 High", desc: "Urgent, immediate action required" },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function ServiceTypeCard({ service, selected, onSelect }) {
  return (
    <button
      onClick={() => onSelect(service.id)}
      className={`relative flex flex-col items-start gap-2 rounded-2xl border p-4 text-left transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${service.ring} ${
        selected
          ? `${service.bg} ${service.border} shadow-md -translate-y-0.5`
          : "border-gray-200 bg-white hover:bg-gray-50 hover:-translate-y-0.5 hover:shadow-sm"
      }`}
    >
      {selected && (
        <div className={`absolute top-0 left-0 h-1 w-full rounded-t-2xl bg-gradient-to-r ${service.color}`} />
      )}
      <span className="text-2xl">{service.icon}</span>
      <div>
        <p className={`text-sm font-bold ${selected ? service.text : "text-gray-700"}`}>{service.label}</p>
        <p className="text-xs text-gray-400 mt-0.5 leading-snug">{service.desc}</p>
      </div>
      {selected && (
        <span className={`absolute top-2.5 right-2.5 text-xs font-bold rounded-full px-2 py-0.5 ${service.tag}`}>
          ✓
        </span>
      )}
    </button>
  );
}

function StepBadge({ step, current, label }) {
  const done = current > step;
  const active = current === step;
  return (
    <div className="flex items-center gap-2">
      <div
        className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
          done
            ? "bg-emerald-500 text-white"
            : active
            ? "bg-blue-600 text-white shadow"
            : "bg-gray-200 text-gray-400"
        }`}
      >
        {done ? "✓" : step}
      </div>
      <span className={`text-xs font-semibold ${active ? "text-blue-700" : done ? "text-emerald-600" : "text-gray-400"}`}>
        {label}
      </span>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ServiceRequestPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1: Type, 2: Details, 3: Confirm
  const [submitted, setSubmitted] = useState(false);

  const [form, setForm] = useState({
    serviceType: "",
    priority: "Medium",
    title: "",
    description: "",
    location: "",
    landmark: "",
    phone: user?.phone || "",
    preferredDate: "",
  });

  const selectedService = SERVICE_TYPES.find((s) => s.id === form.serviceType);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleServiceSelect = (id) => setForm((prev) => ({ ...prev, serviceType: id }));

  const handleNext = () => {
    if (step === 1 && !form.serviceType) {
      alert("Please select a service type.");
      return;
    }
    if (step === 2 && (!form.title || !form.description || !form.location)) {
      alert("Please fill all required fields.");
      return;
    }
    setStep((s) => s + 1);
  };

  const handleSubmit = async () => {
    const payload = { ...form, citizenId: user?.citizenId, email: user?.email, name: user?.name, village: user?.village };
    console.log("Service request submitted:", payload);
    // TODO: await submitServiceRequest(payload);
    setSubmitted(true);
  };

  const handleLogout = () => { logout(); navigate("/login", { replace: true }); };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center px-4">
        <div className="w-full max-w-md rounded-2xl bg-white p-10 shadow-xl flex flex-col items-center gap-4 text-center">
          <span className="text-6xl">✅</span>
          <h2 className="text-2xl font-extrabold text-emerald-700">Request Submitted!</h2>
          <p className="text-sm text-gray-500 leading-relaxed">
            Your <span className="font-bold text-gray-700">{selectedService?.label}</span> request has been successfully submitted to the officer. You will receive updates on your registered contact.
          </p>
          <div className="w-full rounded-xl bg-gray-50 border border-gray-200 p-4 text-xs text-gray-500 text-left space-y-1">
            <p><span className="font-semibold">Service:</span> {selectedService?.label}</p>
            <p><span className="font-semibold">Priority:</span> {form.priority}</p>
            <p><span className="font-semibold">Location:</span> {form.location}</p>
          </div>
          <div className="flex gap-3 w-full mt-2">
            <button
              onClick={() => navigate("/citizen/dashboard")}
              className="flex-1 rounded-xl bg-blue-600 py-2.5 text-sm font-bold text-white hover:bg-blue-700"
            >
              Back to Dashboard
            </button>
            <button
              onClick={() => { setSubmitted(false); setStep(1); setForm({ serviceType: "", priority: "Medium", title: "", description: "", location: "", landmark: "", phone: user?.phone || "", preferredDate: "" }); }}
              className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50"
            >
              New Request
            </button>
          </div>
        </div>
      </div>
    );
  }

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

      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">

        {/* Page Banner */}
        <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-violet-700 via-violet-600 to-purple-600 px-7 py-8 text-white shadow-lg">
          <span className="absolute -top-8 -right-8 h-40 w-40 rounded-full bg-white/10" />
          <span className="absolute -bottom-6 right-24 h-24 w-24 rounded-full bg-white/10" />
          <div className="relative">
            <p className="text-sm font-semibold text-violet-200 uppercase tracking-widest">Civic Services</p>
            <h1 className="mt-1 text-3xl font-extrabold tracking-tight">Submit a Service Request</h1>
            <p className="mt-2 text-sm text-violet-200 max-w-md leading-relaxed">
              Report a civic issue or request a service from your Gram Panchayat officer.
            </p>
          </div>
        </section>

        {/* Step Indicator */}
        <div className="flex items-center gap-4 bg-white rounded-2xl border border-gray-200 px-6 py-4 shadow-sm">
          <StepBadge step={1} current={step} label="Select Service" />
          <div className="flex-1 h-px bg-gray-200" />
          <StepBadge step={2} current={step} label="Request Details" />
          <div className="flex-1 h-px bg-gray-200" />
          <StepBadge step={3} current={step} label="Review & Submit" />
        </div>

        {/* ── Step 1: Select Service Type ─────────────────────────────── */}
        {step === 1 && (
          <section className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-5">
            <div>
              <h2 className="text-sm font-bold text-gray-700 uppercase tracking-widest">Choose Service Type</h2>
              <p className="text-xs text-gray-400 mt-1">Select the category that best matches your request.</p>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {SERVICE_TYPES.map((s) => (
                <ServiceTypeCard
                  key={s.id}
                  service={s}
                  selected={form.serviceType === s.id}
                  onSelect={handleServiceSelect}
                />
              ))}
            </div>
            <div className="flex justify-end pt-2">
              <button
                onClick={handleNext}
                className="rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-bold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
              >
                Next: Add Details →
              </button>
            </div>
          </section>
        )}

        {/* ── Step 2: Request Details ─────────────────────────────────── */}
        {step === 2 && (
          <section className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-5">
            {/* Selected type pill */}
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-gray-700 uppercase tracking-widest">Request Details</h2>
              {selectedService && (
                <span className={`rounded-full px-3 py-0.5 text-xs font-semibold ${selectedService.tag}`}>
                  {selectedService.icon} {selectedService.label}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500">Request Title *</label>
              <input
                name="title" value={form.title} onChange={handleChange}
                placeholder={`e.g. Pothole on main road near temple`}
                className="rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500">Description *</label>
              <textarea
                name="description" value={form.description} onChange={handleChange} rows={4}
                placeholder="Describe the issue or service required in detail..."
                className="rounded-xl border border-gray-200 px-3 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-violet-400"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-500">Location / Area *</label>
                <input
                  name="location" value={form.location} onChange={handleChange}
                  placeholder="e.g. Ward 4, Near Bus Stand"
                  className="rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-500">Landmark (optional)</label>
                <input
                  name="landmark" value={form.landmark} onChange={handleChange}
                  placeholder="e.g. Opposite primary school"
                  className="rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-500">Contact Phone</label>
                <input
                  name="phone" value={form.phone} onChange={handleChange}
                  placeholder="Your phone number"
                  className="rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-500">Preferred Date (optional)</label>
                <input
                  type="date" name="preferredDate" value={form.preferredDate} onChange={handleChange}
                  className="rounded-xl border border-gray-200 px-3 py-2.5 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-violet-400"
                />
              </div>
            </div>

            {/* Priority */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-gray-500">Priority Level</label>
              <div className="flex gap-3 flex-wrap">
                {PRIORITY_LEVELS.map((p) => (
                  <button
                    key={p.value}
                    onClick={() => setForm((prev) => ({ ...prev, priority: p.value }))}
                    className={`flex flex-col items-start rounded-xl border px-4 py-2.5 text-left transition-all focus:outline-none ${
                      form.priority === p.value
                        ? "border-violet-400 bg-violet-50 shadow"
                        : "border-gray-200 bg-white hover:bg-gray-50"
                    }`}
                  >
                    <span className="text-sm font-bold text-gray-700">{p.label}</span>
                    <span className="text-xs text-gray-400">{p.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button onClick={() => setStep(1)} className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50">
                ← Back
              </button>
              <button onClick={handleNext} className="ml-auto rounded-xl bg-violet-600 px-6 py-2.5 text-sm font-bold text-white hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-offset-2">
                Review Request →
              </button>
            </div>
          </section>
        )}

        {/* ── Step 3: Review & Submit ─────────────────────────────────── */}
        {step === 3 && (
          <section className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-5">
            <h2 className="text-sm font-bold text-gray-700 uppercase tracking-widest">Review & Submit</h2>

            {/* Summary Card */}
            <div className={`rounded-2xl border ${selectedService?.border} ${selectedService?.bg} p-5 space-y-3`}>
              <div className="flex items-center gap-3">
                <span className="text-3xl">{selectedService?.icon}</span>
                <div>
                  <p className={`font-extrabold text-base ${selectedService?.text}`}>{selectedService?.label}</p>
                  <span className={`text-xs font-semibold rounded-full px-2 py-0.5 ${selectedService?.tag}`}>
                    {form.priority} Priority
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
                {[
                  { label: "Citizen Name", value: user?.name },
                  { label: "Citizen ID", value: user?.citizenId || "N/A" },
                  { label: "Email", value: user?.email },
                  { label: "Phone", value: form.phone || "N/A" },
                  { label: "Title", value: form.title },
                  { label: "Location", value: form.location },
                  { label: "Landmark", value: form.landmark || "N/A" },
                  { label: "Preferred Date", value: form.preferredDate || "Not specified" },
                ].map((row) => (
                  <div key={row.label}>
                    <span className="text-xs text-gray-400">{row.label}</span>
                    <p className="font-medium text-gray-800 truncate">{row.value}</p>
                  </div>
                ))}
              </div>

              <div>
                <span className="text-xs text-gray-400">Description</span>
                <p className="text-sm text-gray-700 leading-relaxed mt-0.5">{form.description}</p>
              </div>
            </div>

            <p className="text-xs text-gray-400 leading-relaxed">
              By submitting, you confirm that the above information is accurate and consent to the Gram Panchayat officer processing this request.
            </p>

            <div className="flex gap-3 pt-1">
              <button onClick={() => setStep(2)} className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50">
                ← Edit Details
              </button>
              <button
                onClick={handleSubmit}
                className="ml-auto rounded-xl bg-gradient-to-r from-violet-600 to-purple-700 px-8 py-2.5 text-sm font-bold text-white shadow hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-offset-2"
              >
                🛠️ Submit Request
              </button>
            </div>
          </section>
        )}

      </main>
    </div>
  );
}