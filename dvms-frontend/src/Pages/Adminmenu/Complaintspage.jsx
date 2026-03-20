
import { AlertCircle, Eye, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import {
  getComplaints,
  getComplaintsByStatus,
  updateComplaintStatus,
} from "../../Services/AdminComplaintService";
import { EmptyState, Modal, Spinner } from "../Adminmenu/Ui";

// Badge colour map — kept here for co-location with the table rendering
const statusColors = {
  PENDING:      "bg-amber-100 text-amber-700",
  IN_PROGRESS:  "bg-blue-100 text-blue-700",
  RESOLVED:     "bg-emerald-100 text-emerald-700",
};

const STATUS_OPTIONS = ["PENDING", "IN_PROGRESS", "RESOLVED"];

const STATUS_LABELS = {
  ALL:         "All",
  PENDING:     "Pending",
  IN_PROGRESS: "In Progress",
  RESOLVED:    "Resolved",
};

export default function ComplaintsPage({ toast }) {
  const [complaints,   setComplaints]   = useState([]);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [loading,      setLoading]      = useState(true);
  const [viewItem,     setViewItem]     = useState(null);
  const [editItem,     setEditItem]     = useState(null);

  // ── Fetch complaints (re-runs when statusFilter changes) ──
  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const data = statusFilter === "ALL"
        ? await getComplaints()
        : await getComplaintsByStatus(statusFilter);
      setComplaints(data);
    } catch {
      toast("Failed to load complaints", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, [statusFilter]);

  const updateStatus = async (id, status) => {
    try {
      await updateComplaintStatus(id, status);
      toast(`Status updated to ${STATUS_LABELS[status] ?? status}`);
      setEditItem(null);
      fetchComplaints();
    } catch {
      toast("Failed to update status", "error");
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="space-y-4">
      {/* ── Status filter pills ── */}
      <div className="flex gap-2 flex-wrap">
        {["ALL", ...STATUS_OPTIONS].map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              statusFilter === s
                ? "bg-blue-600 text-white"
                : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            {STATUS_LABELS[s]}
          </button>
        ))}
      </div>

      {/* ── Table ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {complaints.length === 0 ? (
          <EmptyState icon={AlertCircle} message="No complaints found" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  {["Title", "Filed By", "Officer", "Status", "Date", "Actions"].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {complaints.map((c) => (
                  <tr
                    key={c.id}
                    className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="px-4 py-3 font-medium text-slate-800 max-w-[180px] truncate">
                      {c.title}
                    </td>
                    <td className="px-4 py-3 text-slate-500">{c.user}</td>
                    <td className="px-4 py-3 text-slate-500">{c.officer}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[c.status]}`}>
                        {STATUS_LABELS[c.status] ?? c.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-400">{c.date}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <button
                          onClick={() => setViewItem(c)}
                          className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600"
                          title="View details"
                        >
                          <Eye size={14} />
                        </button>
                        <button
                          onClick={() => setEditItem(c)}
                          className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-400 hover:text-blue-600"
                          title="Update status"
                        >
                          <RefreshCw size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── View Detail Modal ── */}
      <Modal open={!!viewItem} onClose={() => setViewItem(null)} title="Complaint Details">
        {viewItem && (
          <div className="space-y-3">
            <div>
              <p className="text-xs text-slate-400 uppercase font-semibold">Title</p>
              <p className="font-semibold text-slate-800 mt-0.5">{viewItem.title}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase font-semibold">Description</p>
              <p className="text-slate-600 mt-0.5 text-sm">{viewItem.desc}</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-slate-400 uppercase font-semibold">Filed By</p>
                <p className="text-slate-700 mt-0.5 text-sm">{viewItem.user}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase font-semibold">Officer</p>
                <p className="text-slate-700 mt-0.5 text-sm">{viewItem.officer}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase font-semibold">Status</p>
                <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium mt-0.5 ${statusColors[viewItem.status]}`}>
                  {STATUS_LABELS[viewItem.status] ?? viewItem.status}
                </span>
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase font-semibold">Date</p>
                <p className="text-slate-700 mt-0.5 text-sm">{viewItem.date}</p>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* ── Update Status Modal ── */}
      <Modal open={!!editItem} onClose={() => setEditItem(null)} title="Update Complaint Status">
        {editItem && (
          <div className="space-y-4">
            <p className="text-sm text-slate-600">
              Update status for:{" "}
              <span className="font-medium text-slate-800">{editItem.title}</span>
            </p>
            <div className="grid grid-cols-1 gap-2">
              {STATUS_OPTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => updateStatus(editItem.id, s)}
                  className={`w-full py-2.5 rounded-xl text-sm font-medium border transition-colors ${
                    editItem.status === s
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {STATUS_LABELS[s]}
                </button>
              ))}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}