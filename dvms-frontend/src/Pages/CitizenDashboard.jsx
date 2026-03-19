import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

import { getComplaints } from "../Services/complaintService";


const QUICK_ACTIONS = [
  {
    id: "apply_scheme",
    label: "Apply for Scheme",
    desc: "Browse & apply for government welfare schemes",
    icon: "📝",
    route: "/citizen/schemes/apply",
    color: "bg-blue-600 hover:bg-blue-700",
    ring: "focus:ring-blue-400",
  },
  {
    id: "raise_complaint",
    label: "Raise Complaint",
    desc: "Register a grievance or service issue",
    icon: "📣",
    route: "/citizen/complaints/new",
    color: "bg-amber-500 hover:bg-amber-600",
    ring: "focus:ring-amber-400",
  },
  {
    id: "request_service",
    label: "Request Service",
    desc: "Submit a new civic service request",
    icon: "🛠️",
    route: "/citizen/services/new",
    color: "bg-violet-600 hover:bg-violet-700",
    ring: "focus:ring-violet-400",
  },
  {
    id: "announcements",
    label: "View Announcements",
    desc: "Latest notices from the Gram Panchayat",
    icon: "📢",
    route: "/citizen/announcements",
    color: "bg-emerald-600 hover:bg-emerald-700",
    ring: "focus:ring-emerald-400",
  },
];


// ─── Sub-components ─────────────────────────────────────────────────────────

function StatCard({ card }) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl border ${card.border} ${card.bg} p-5 shadow-sm transition-transform duration-200 hover:-translate-y-1 hover:shadow-md`}
    >
      {/* gradient accent strip */}
      <div
        className={`absolute top-0 left-0 h-1 w-full rounded-t-2xl bg-linear-to-r ${card.color}`}
      />

      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-500">
            {card.label}
          </p>
          <p className={`mt-2 text-4xl font-extrabold ${card.text}`}>
            {card.value}
          </p>
        </div>
        <span className="text-3xl select-none">{card.icon}</span>
      </div>
    </div>
  );
}

function QuickActionButton({ action, onClick }) {
  return (
    <button
      onClick={() => onClick(action.route)}
      className={`group flex flex-col items-start gap-1 rounded-2xl p-5 text-left text-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 ${action.color} ${action.ring}`}
    >
      <span className="text-3xl">{action.icon}</span>
      <span className="mt-1 text-sm font-bold leading-tight">{action.label}</span>
      <span className="text-xs text-white/80 leading-snug">{action.desc}</span>
    </button>
  );
}

function RecentActivityRow({ item }) {
  return (
    <li className="flex items-center justify-between gap-4 py-3 border-b border-gray-100 last:border-0">
      <div className="min-w-0">
        <p className="text-sm font-medium text-gray-800 truncate">{item.title}</p>
        <p className="text-xs text-gray-400 mt-0.5">{item.date}</p>
      </div>
      <span
        className={`shrink-0 rounded-full px-3 py-0.5 text-xs font-semibold ${item.statusColor}`}
      >
        {item.status}
      </span>
    </li>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function CitizenDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);

  const stats = [
    {
      id: "total",
      label: "Total Complaints",
      value: complaints.length,
      icon: "📋",
      color: "from-blue-500 to-blue-700",
      bg: "bg-blue-50",
      border: "border-blue-200",
      text: "text-blue-700",
    },
    {
      id: "pending",
      label: "Pending Complaints",
      value: complaints.filter(c => c.status === "Pending").length,
      icon: "⏳",
      color: "from-amber-400 to-orange-500",
      bg: "bg-amber-50",
      border: "border-amber-200",
      text: "text-amber-700",
    },
    {
      id: "inprogress",
      label: "In Progress",
      value: complaints.filter(c => c.status === "In Progress").length,
      icon: "🔔",
      color: "from-violet-500 to-purple-700",
      bg: "bg-violet-50",
      border: "border-violet-200",
      text: "text-violet-700",
    },
    {
      id: "resolved",
      label: "Resolved",
      value: complaints.filter(c => c.status === "Resolved").length,
      icon: "✅",
      color: "from-emerald-400 to-green-600",
      bg: "bg-emerald-50",
      border: "border-emerald-200",
      text: "text-emerald-700",
    },
  ];

  const recentActivities = complaints.slice(0, 5).map((c, index) => ({
    id: index,
    title: `${c.category} complaint`,
    date: new Date(c.createdAt).toLocaleDateString(),
    status: c.status,
    statusColor:
      c.status === "Pending"
        ? "bg-amber-100 text-amber-700"
        : c.status === "In Progress"
        ? "bg-blue-100 text-blue-700"
        : "bg-emerald-100 text-emerald-700",
  }));

  const [greeting] = useState(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  });

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3 text-gray-500">
          <svg
            className="h-8 w-8 animate-spin text-blue-500"
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8z"
            />
          </svg>
          <p className="text-sm font-medium">Loading your dashboard…</p>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const handleQuickAction = (route) => navigate(route);
  useEffect(() => {
  const fetchData = async () => {
    try {
      const data = await getComplaints(user?.email);
      console.log("Dashboard complaints:", data); // debug
      setComplaints(data);
    } catch (err) {
      console.error("Error fetching complaints:", err);
    }
  };

  if (user?.email) {
    fetchData();
  }
}, [user]);

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50">

      {/* ── Top Header Bar ─────────────────────────────────────────────── */}
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-blue-100 bg-white/80 px-6 py-3 shadow-sm backdrop-blur-md">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br from-blue-600 to-indigo-700 text-white shadow">
            <span className="text-lg">🏛️</span>
          </div>
          <div className="leading-tight">
            <p className="text-xs font-bold uppercase tracking-widest text-blue-700">
              DVMS
            </p>
            <p className="text-[10px] text-gray-400 tracking-wide">
              Digital Village Management System
            </p>
          </div>
        </div>

        {/* User info + logout */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex flex-col items-end leading-tight">
            <span className="text-sm font-semibold text-gray-800">
              {user.name}
            </span>
            <span className="text-xs text-gray-400">Citizen · {user.village || "Gram Panchayat"}</span>
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-linear-to-br from-blue-500 to-indigo-600 text-sm font-bold text-white uppercase shadow">
            {user.name?.charAt(0) ?? "C"}
          </div>
          <button
            onClick={handleLogout}
            className="ml-1 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-1"
          >
            Logout
          </button>
        </div>
      </header>

      {/* ── Page Body ──────────────────────────────────────────────────── */}
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">

        {/* Welcome Banner */}
        <section className="relative overflow-hidden rounded-2xl bg-linear-to-r from-blue-700 via-blue-600 to-indigo-600 px-7 py-8 text-white shadow-lg">
          {/* decorative circles */}
          <span className="absolute -top-8 -right-8 h-40 w-40 rounded-full bg-white/10" />
          <span className="absolute -bottom-6 right-24 h-24 w-24 rounded-full bg-white/10" />

          <div className="relative">
            <p className="text-sm font-semibold text-blue-200 uppercase tracking-widest">
              {greeting} 👋
            </p>
            <h1 className="mt-1 text-3xl font-extrabold tracking-tight">
              {user.name}
            </h1>
            <p className="mt-2 text-sm text-blue-200 max-w-md leading-relaxed">
              Here's an overview of your citizen activities and services under{" "}
              <span className="font-semibold text-white">
                {user.village || "your Gram Panchayat"}
              </span>
              .
            </p>
            <div className="mt-4 flex flex-wrap gap-2 text-xs">
              <span className="rounded-full bg-white/20 px-3 py-1">
                🆔 Citizen ID: {user.citizenId || "N/A"}
              </span>
              <span className="rounded-full bg-white/20 px-3 py-1">
                📅 {new Date().toLocaleDateString("en-IN", { dateStyle: "long" })}
              </span>
            </div>
          </div>
        </section>

        {/* Statistics Grid */}
        <section>
          <h2 className="mb-4 text-xs font-bold uppercase tracking-widest text-gray-500">
            Activity Overview
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((card) => (
              <StatCard key={card.id} card={card} />
            ))}
          </div>
        </section>

        {/* Quick Actions */}
        <section>
          <h2 className="mb-4 text-xs font-bold uppercase tracking-widest text-gray-500">
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {QUICK_ACTIONS.map((action) => (
              <QuickActionButton
                key={action.id}
                action={action}
                onClick={handleQuickAction}
              />
            ))}
          </div>
        </section>

        {/* Bottom row: Recent Activity + Info Cards */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

          {/* Recent Activity — wider */}
          <section className="lg:col-span-2 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-gray-700 uppercase tracking-widest">
                Recent Activity
              </h2>
              <button
                onClick={() => navigate("/citizen/history")}
                className="text-xs font-semibold text-blue-600 hover:underline"
              >
                View All →
              </button>
            </div>
            <ul>
              {recentActivities.map((item) => (
                <RecentActivityRow key={item.id} item={item} />
              ))}
            </ul>
          </section>

          {/* Info / Help card */}
          <section className="flex flex-col gap-4">
            {/* Helpline */}
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-widest text-emerald-700 mb-2">
                🆘 Helpline
              </p>
              <p className="text-sm text-gray-700 leading-relaxed">
                For urgent civic issues, call the Gram Panchayat helpline:
              </p>
              <p className="mt-2 text-xl font-extrabold text-emerald-700">
                1800-XXX-XXXX
              </p>
              <p className="text-xs text-gray-400 mt-1">Mon – Sat, 9 AM – 5 PM</p>
            </div>

            {/* Notice */}
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-widest text-amber-700 mb-2">
                📢 Latest Notice
              </p>
              <p className="text-sm text-gray-700 leading-relaxed">
                Gram Sabha meeting scheduled for{" "}
                <span className="font-semibold">15 March 2026</span> at the
                Village Community Hall.
              </p>
              <button
                onClick={() => navigate("/citizen/announcements")}
                className="mt-3 text-xs font-semibold text-amber-700 hover:underline"
              >
                More Announcements →
              </button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}