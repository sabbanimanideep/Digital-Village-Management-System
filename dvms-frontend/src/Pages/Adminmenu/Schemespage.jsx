// src/pages/SchemesPage.jsx
// Browse and manage government welfare schemes.
// ─────────────────────────────────────────────────────────────────────────────
// Features:  Toggle active/inactive · View detail · Edit · Delete
// Data:      mockSchemes  ← src/data/mockData.js
// Shared UI: Modal, ConfirmDelete, Spinner, EmptyState  ← src/components/UI.jsx

import { Eye, FileText, Pencil, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { mockSchemes } from "../Adminmenu/Mockdata";
import { ConfirmDelete, EmptyState, Modal, Spinner } from "../Adminmenu/Ui";

export default function SchemesPage({ toast }) {
  const [schemes,      setSchemes]      = useState(mockSchemes);
  const [loading,      setLoading]      = useState(true);
  const [editItem,     setEditItem]     = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [viewItem,     setViewItem]     = useState(null);
  const [form,         setForm]         = useState({});

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  // ── Handlers ──
  const toggleStatus = (id) => {
    setSchemes((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, status: s.status === "Active" ? "Inactive" : "Active" } : s
      )
    );
    toast("Scheme status updated");
  };

  const openEdit = (s) => { setForm({ ...s }); setEditItem(s); };

  const handleSave = () => {
    setSchemes((prev) => prev.map((s) => (s.id === form.id ? { ...s, ...form } : s)));
    toast("Scheme updated");
    setEditItem(null);
  };

  const handleDelete = () => {
    setSchemes((prev) => prev.filter((s) => s.id !== deleteTarget.id));
    toast("Scheme deleted");
    setDeleteTarget(null);
  };

  if (loading) return <Spinner />;

  return (
    <div className="space-y-4">
      {/* ── Card grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {schemes.length === 0 ? (
          <EmptyState icon={FileText} message="No schemes found" />
        ) : (
          schemes.map((s) => (
            <div
              key={s.id}
              className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 hover:shadow-md transition-shadow"
            >
              {/* Header row */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-800 text-sm">{s.name}</h3>
                  <span className="text-xs text-slate-400">{s.category}</span>
                </div>
                {/* Clickable status badge toggles active/inactive */}
                <button
                  onClick={() => toggleStatus(s.id)}
                  className={`px-2.5 py-1 rounded-full text-xs font-medium cursor-pointer transition-colors ${
                    s.status === "Active"
                      ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                      : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                  }`}
                >
                  {s.status}
                </button>
              </div>

              <p className="text-sm text-slate-500 mb-4 line-clamp-2">{s.desc}</p>

              {/* Footer row */}
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">{s.beneficiaries} beneficiaries</span>
                <div className="flex gap-1">
                  <button
                    onClick={() => setViewItem(s)}
                    className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400"
                    title="View details"
                  >
                    <Eye size={14} />
                  </button>
                  <button
                    onClick={() => openEdit(s)}
                    className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-400"
                    title="Edit"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => setDeleteTarget(s)}
                    className="p-1.5 rounded-lg hover:bg-red-50 text-red-400"
                    title="Delete"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ── View Detail Modal ── */}
      <Modal open={!!viewItem} onClose={() => setViewItem(null)} title="Scheme Details">
        {viewItem && (
          <div className="space-y-3">
            <div>
              <p className="text-xs text-slate-400 uppercase font-semibold">Name</p>
              <p className="font-semibold text-slate-800 mt-0.5">{viewItem.name}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase font-semibold">Description</p>
              <p className="text-sm text-slate-600 mt-0.5">{viewItem.desc}</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-slate-400 uppercase font-semibold">Category</p>
                <p className="text-slate-700 text-sm mt-0.5">{viewItem.category}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase font-semibold">Status</p>
                <span
                  className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium mt-0.5 ${
                    viewItem.status === "Active"
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {viewItem.status}
                </span>
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase font-semibold">Beneficiaries</p>
                <p className="text-slate-700 text-sm mt-0.5">{viewItem.beneficiaries}</p>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* ── Edit Modal ── */}
      <Modal open={!!editItem} onClose={() => setEditItem(null)} title="Edit Scheme">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
            <input
              value={form.name || ""}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
            <textarea
              value={form.desc || ""}
              onChange={(e) => setForm((p) => ({ ...p, desc: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
            <input
              value={form.category || ""}
              onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex gap-3 justify-end pt-1">
            <button
              onClick={() => setEditItem(null)}
              className="px-4 py-2 border border-slate-200 rounded-xl text-sm text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700"
            >
              Save Changes
            </button>
          </div>
        </div>
      </Modal>

      {/* ── Delete Confirm ── */}
      <ConfirmDelete
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        label={deleteTarget?.name}
      />
    </div>
  );
}