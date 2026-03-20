

import { Bell, Calendar, ChevronRight, Megaphone, Search, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { getAnnouncements } from "../../Services/Citizenannouncementservice";

function Spinner() {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4">
      <div className="w-10 h-10 border-4 border-emerald-200 border-t-emerald-500 rounded-full animate-spin" />
      <p className="text-sm text-slate-400 font-medium">Loading announcements…</p>
    </div>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────
function EmptyState({ query }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-3 text-center">
      <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center">
        <Megaphone size={28} className="text-slate-300" />
      </div>
      <p className="font-semibold text-slate-600">
        {query ? `No results for "${query}"` : "No announcements yet"}
      </p>
      <p className="text-sm text-slate-400 max-w-xs">
        {query ? "Try a different search term." : "Check back later for updates from your local office."}
      </p>
    </div>
  );
}

// ─── Detail Modal ─────────────────────────────────────────────────────────────
function DetailModal({ item, onClose }) {
  if (!item) return null;

  const dateStr = item.createdAt
    ? new Date(item.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })
    : item.date || "";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden animate-modal">
        {/* Top accent bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400" />

        <div className="p-7">
          {/* Header */}
          <div className="flex items-start justify-between gap-4 mb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 flex items-center justify-center flex-shrink-0">
                <Bell size={18} className="text-emerald-500" />
              </div>
              <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                Official Announcement
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors flex-shrink-0"
            >
              <X size={18} />
            </button>
          </div>

          {/* Title */}
          <h2 className="text-xl font-bold text-slate-800 leading-snug mb-3">
            {item.title}
          </h2>

          {/* Date */}
          {dateStr && (
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-5">
              <Calendar size={13} />
              <span>{dateStr}</span>
            </div>
          )}

          {/* Divider */}
          <div className="border-t border-slate-100 mb-5" />

          {/* Body */}
          <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">
            {item.description || item.desc || "No additional details provided."}
          </p>
        </div>
      </div>

      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: translateY(16px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)     scale(1);    }
        }
        .animate-modal { animation: modalIn 0.22s ease-out both; }
      `}</style>
    </div>
  );
}

// ─── Announcement Card ────────────────────────────────────────────────────────
function AnnouncementCard({ item, onClick }) {
  const dateStr = item.createdAt
    ? new Date(item.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
    : item.date || "";

  const preview = (item.description || item.desc || "").slice(0, 120);

  return (
    <button
      onClick={onClick}
      className="group w-full text-left bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all duration-200 p-5 flex gap-4 items-start"
    >
      {/* Icon */}
      <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0 group-hover:bg-emerald-100 transition-colors">
        <Megaphone size={18} className="text-emerald-500" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-slate-800 text-sm leading-snug mb-1 truncate">
          {item.title}
        </h3>
        {preview && (
          <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 mb-2">
            {preview}{(item.description || item.desc || "").length > 120 ? "…" : ""}
          </p>
        )}
        {dateStr && (
          <div className="flex items-center gap-1 text-xs text-slate-400">
            <Calendar size={11} />
            <span>{dateStr}</span>
          </div>
        )}
      </div>

      {/* Arrow */}
      <ChevronRight
        size={16}
        className="text-slate-300 group-hover:text-emerald-400 transition-colors flex-shrink-0 mt-1"
      />
    </button>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function CitizenAnnouncementsPage() {
  const [items,      setItems]      = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [search,     setSearch]     = useState("");
  const [selected,   setSelected]   = useState(null);   // full detail item

  // Fetch on mount
  useEffect(() => {
    (async () => {
      try {
        const data = await getAnnouncements();
        setItems(data);
      } catch {
        // silently fail — EmptyState will show
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Client-side search
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (a) =>
        a.title?.toLowerCase().includes(q) ||
        (a.description || a.desc || "").toLowerCase().includes(q)
    );
  }, [items, search]);

  const handleCardClick = (item) => setSelected(item);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ── Page Header ── */}
      <div className="bg-white border-b border-slate-100 px-4 md:px-8 py-6">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-9 h-9 rounded-xl bg-emerald-500 flex items-center justify-center">
              <Megaphone size={18} className="text-white" />
            </div>
            <h1 className="text-xl font-bold text-slate-800">Announcements</h1>
          </div>
          <p className="text-sm text-slate-500 ml-12">
            Stay up to date with official notices from your local office.
          </p>
        </div>
      </div>

      {/* ── Search Bar ── */}
      <div className="px-4 md:px-8 py-4 bg-white border-b border-slate-100">
        <div className="max-w-2xl mx-auto">
          <div className="relative">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search announcements…"
              className="w-full pl-9 pr-9 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X size={14} />
              </button>
            )}
          </div>
          {search && !loading && (
            <p className="text-xs text-slate-400 mt-2 ml-1">
              {filtered.length} result{filtered.length !== 1 ? "s" : ""} for "{search}"
            </p>
          )}
        </div>
      </div>

      {/* ── Content ── */}
      <div className="px-4 md:px-8 py-6 max-w-2xl mx-auto">
        {loading ? (
          <Spinner />
        ) : filtered.length === 0 ? (
          <EmptyState query={search} />
        ) : (
          <div className="space-y-3">
            {filtered.map((a) => (
              <AnnouncementCard
                key={a.id}
                item={a}
                onClick={() => handleCardClick(a)}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Detail Modal ── */}
      <DetailModal item={selected} onClose={() => setSelected(null)} />
    </div>
  );
}