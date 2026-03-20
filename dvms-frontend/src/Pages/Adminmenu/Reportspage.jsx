// src/pages/ReportsPage.jsx
// Analytics charts: complaints trend, user growth, scheme beneficiary counts.
// ─────────────────────────────────────────────────────────────────────────────
// Charts used: AreaChart, BarChart (recharts)
// Data:        complaintsOverTime, userGrowthData, schemeUsageData  ← src/data/mockData.js
// Shared UI:   Spinner  ← src/components/UI.jsx

import { Filter } from "lucide-react";
import { useEffect, useState } from "react";
import {
    Area, AreaChart, Bar, BarChart,
    CartesianGrid, ResponsiveContainer,
    Tooltip, XAxis, YAxis,
} from "recharts";
import { complaintsOverTime, schemeUsageData, userGrowthData } from "../Adminmenu/Mockdata";
import { Spinner } from "../Adminmenu/Ui";

export default function ReportsPage() {
  const [loading,   setLoading]   = useState(true);
  const [dateRange, setDateRange] = useState("last6months");
  const [category,  setCategory]  = useState("All");

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 900);
    return () => clearTimeout(t);
  }, []);

  if (loading) return <Spinner />;

  return (
    <div className="space-y-5">
      {/* ── Filters ── */}
      <div className="flex flex-wrap gap-3 items-center bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
        <Filter size={16} className="text-slate-400" />
        <select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          className="px-3 py-1.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
          <option value="last6months">Last 6 Months</option>
          <option value="last3months">Last 3 Months</option>
          <option value="lastyear">Last Year</option>
        </select>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="px-3 py-1.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
          {["All", "Complaints", "Users", "Schemes"].map((c) => <option key={c}>{c}</option>)}
        </select>
      </div>

      {/* ── Chart grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Complaints Over Time */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
          <h3 className="font-semibold text-slate-800 text-sm mb-4">Complaints Over Time</h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={complaintsOverTime}>
              <defs>
                <linearGradient id="cg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#3b82f6" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}   />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis                 tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <Tooltip />
              <Area type="monotone" dataKey="complaints" stroke="#3b82f6" fill="url(#cg)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* User Growth */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
          <h3 className="font-semibold text-slate-800 text-sm mb-4">User Growth</h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={userGrowthData}>
              <defs>
                <linearGradient id="ug" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#6366f1" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}   />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis                 tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <Tooltip />
              <Area type="monotone" dataKey="users" stroke="#6366f1" fill="url(#ug)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Scheme Usage — full width */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 lg:col-span-2">
          <h3 className="font-semibold text-slate-800 text-sm mb-4">Scheme Usage (Beneficiaries)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={schemeUsageData} barSize={32}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis                tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <Tooltip />
              <Bar dataKey="users" fill="#10b981" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}