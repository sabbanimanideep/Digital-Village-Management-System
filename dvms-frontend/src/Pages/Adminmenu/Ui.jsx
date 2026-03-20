

import { Bell, Check, Loader2, Trash2, X } from "lucide-react";

// ─── TOAST ───────────────────────────────────────────────────────────────────

export function Toast({ toasts, removeToast }) {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg text-white text-sm font-medium min-w-[260px] transition-all duration-300
            ${t.type === "success" ? "bg-emerald-500" : t.type === "error" ? "bg-red-500" : "bg-blue-500"}`}
        >
          {t.type === "success" ? (
            <Check size={16} />
          ) : t.type === "error" ? (
            <X size={16} />
          ) : (
            <Bell size={16} />
          )}
          <span className="flex-1">{t.message}</span>
          <button onClick={() => removeToast(t.id)} className="opacity-70 hover:opacity-100">
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}

// ─── MODAL ───────────────────────────────────────────────────────────────────

export function Modal({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600"
          >
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ─── CONFIRM DELETE ──────────────────────────────────────────────────────────

export function ConfirmDelete({ open, onClose, onConfirm, label }) {
  return (
    <Modal open={open} onClose={onClose} title="Confirm Delete">
      <p className="text-slate-600 mb-6">
        Are you sure you want to delete{" "}
        <span className="font-semibold text-slate-800">"{label}"</span>? This action cannot be
        undone.
      </p>
      <div className="flex gap-3 justify-end">
        <button
          onClick={onClose}
          className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-medium"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 text-sm font-medium flex items-center gap-2"
        >
          <Trash2 size={14} /> Delete
        </button>
      </div>
    </Modal>
  );
}

// ─── SPINNER ─────────────────────────────────────────────────────────────────

export function Spinner() {
  return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="animate-spin text-blue-500" size={36} />
    </div>
  );
}

// ─── EMPTY STATE ─────────────────────────────────────────────────────────────

export function EmptyState({ icon: Icon, message }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-slate-400">
      <Icon size={40} className="mb-3 opacity-40" />
      <p className="text-sm">{message}</p>
    </div>
  );
}

// ─── STAT CARD ───────────────────────────────────────────────────────────────

export function StatCard({ label, value, icon: Icon, color, bg }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 flex items-center gap-4 hover:shadow-md transition-shadow">
      <div className={`${bg} p-3 rounded-xl`}>
        <Icon size={22} className={color} />
      </div>
      <div>
        <p className="text-2xl font-bold text-slate-800">{value}</p>
        <p className="text-xs text-slate-500 font-medium mt-0.5">{label}</p>
      </div>
    </div>
  );
}