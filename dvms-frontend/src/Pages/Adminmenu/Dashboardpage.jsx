// src/pages/DashboardPage.jsx
// Overview page — KPI stat cards + two pie charts.
// ─────────────────────────────────────────────────────────────────────────────
// Charts used:   PieChart (recharts)
// Data:          complaintStatusData, userRoleData  ← src/data/mockData.js
// Shared UI:     StatCard, Spinner                  ← src/components/UI.jsx

import { AlertTriangle, CheckCircle, FileText, UserCheck, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { complaintStatusData, userRoleData } from "../Adminmenu/Mockdata";
import { Spinner, StatCard } from "../Adminmenu/Ui";

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(t);
  }, []);

  if (loading) return <Spinner />;

  return (
    <div className="space-y-6">
      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        <StatCard label="Total Citizens"      value="1,284" icon={Users}        color="text-blue-600"   bg="bg-blue-50"   />
        <StatCard label="Total Officers"      value="48"    icon={UserCheck}    color="text-indigo-600" bg="bg-indigo-50" />
        <StatCard label="Active Schemes"      value="4"     icon={FileText}     color="text-emerald-600" bg="bg-emerald-50"/>
        <StatCard label="Pending Complaints"  value="2"     icon={AlertTriangle} color="text-amber-600"  bg="bg-amber-50"  />
        <StatCard label="Completed Requests"  value="96"    icon={CheckCircle}  color="text-teal-600"   bg="bg-teal-50"   />
      </div>

      {/* ── Charts ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
          <h3 className="font-semibold text-slate-800 mb-4 text-sm">Complaint Status Distribution</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={complaintStatusData}
                cx="50%" cy="50%"
                innerRadius={55} outerRadius={85}
                paddingAngle={4}
                dataKey="value"
              >
                {complaintStatusData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
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
              <Pie
                data={userRoleData}
                cx="50%" cy="50%"
                innerRadius={55} outerRadius={85}
                paddingAngle={4}
                dataKey="value"
              >
                {userRoleData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
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