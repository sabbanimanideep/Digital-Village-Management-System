

import { Megaphone, Pencil, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import {
  createAnnouncement,
  deleteAnnouncement,
  getAnnouncements,
  updateAnnouncement,
} from "../../Services/announcementService";
import { ConfirmDelete, EmptyState, Modal, Spinner } from "../Adminmenu/Ui";

// Normalize API response to always return a plain array
const toArray = (data) => {
  if (Array.isArray(data))                 return data;
  if (data && Array.isArray(data.content)) return data.content;
  if (data && Array.isArray(data.data))    return data.data;
  if (data && Array.isArray(data.results)) return data.results;
  return [];
};

export default function AnnouncementsPage({ toast }) {
  const [items,        setItems]        = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [modal,        setModal]        = useState(null);   // "add" | "edit" | null
  const [form,         setForm]         = useState({ title: "", description: "" });
  const [deleteTarget, setDeleteTarget] = useState(null);

  // ── Fetch ──
  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await getAnnouncements();
      setItems(toArray(data));
    } catch {
      toast("Failed to load announcements", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ── Handlers ──
  const openAdd  = () => { setForm({ title: "", description: "" }); setModal("add"); };
  const openEdit = (a) => { setForm({ id: a.id, title: a.title, description: a.description }); setModal("edit"); };

  const handleSave = async () => {
    if (!form.title) { toast("Title is required", "error"); return; }
    try {
      if (modal === "add") {
        await createAnnouncement({ title: form.title, description: form.description });
        toast("Announcement published");
      } else {
        await updateAnnouncement(form.id, { title: form.title, description: form.description });
        toast("Announcement updated");
      }
      setModal(null);
      fetchData();
    } catch {
      toast("Failed to save announcement", "error");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteAnnouncement(deleteTarget.id);
      toast("Announcement deleted");
      setDeleteTarget(null);
      fetchData();
    } catch {
      toast("Failed to delete announcement", "error");
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="space-y-4">
      {/* ── Toolbar ── */}
      <div className="flex justify-end">
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          <Plus size={16} /> New Announcement
        </button>
      </div>

      {/* ── Card list ── */}
      {items.length === 0 ? (
        <EmptyState icon={Megaphone} message="No announcements yet" />
      ) : (
        <div className="space-y-3">
          {items.map((a) => (
            <div
              key={a.id}
              className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-800 text-sm mb-1">{a.title}</h3>
                  <p className="text-sm text-slate-500 mb-2">{a.description}</p>
                  <p className="text-xs text-slate-400">
                    {a.createdAt ? a.createdAt.replace("T", " ") : a.date}
                  </p>
                </div>

                <div className="flex gap-1 flex-shrink-0">
                  <button
                    onClick={() => openEdit(a)}
                    className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-400 hover:text-blue-600"
                    title="Edit"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => setDeleteTarget(a)}
                    className="p-1.5 rounded-lg hover:bg-red-50 text-red-400 hover:text-red-600"
                    title="Delete"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Add / Edit Modal ── */}
      <Modal
        open={!!modal}
        onClose={() => setModal(null)}
        title={modal === "add" ? "New Announcement" : "Edit Announcement"}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
            <input
              value={form.title || ""}
              onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
            <textarea
              value={form.description || ""}
              onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>
          <div className="flex gap-3 justify-end pt-1">
            <button
              onClick={() => setModal(null)}
              className="px-4 py-2 border border-slate-200 rounded-xl text-sm text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700"
            >
              {modal === "add" ? "Publish" : "Update"}
            </button>
          </div>
        </div>
      </Modal>

      {/* ── Delete Confirm ── */}
      <ConfirmDelete
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        label={deleteTarget?.title}
      />
    </div>
  );
}