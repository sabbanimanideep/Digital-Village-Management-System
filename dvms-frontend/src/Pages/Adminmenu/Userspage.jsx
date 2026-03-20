// src/pages/UsersPage.jsx
// Manage all villager and officer accounts.
// ─────────────────────────────────────────────────────────────────────────────
// Features:  Search by name/email · Filter by role · Add · Edit · Delete
// Data:      userService  ← src/services/userService.js
// Shared UI: Modal, ConfirmDelete, Spinner, EmptyState  ← src/components/UI.jsx

import { Pencil, Plus, Search, Trash2, Users } from "lucide-react";
import { useEffect, useState } from "react";
import {
  addUser,
  deleteUser,
  getUsers,
  getUsersByRole,
  updateUser,
} from "../../Services/userService";
import { ConfirmDelete, EmptyState, Modal, Spinner } from "../Adminmenu/Ui";

export default function UsersPage({ toast }) {
  const [users,        setUsers]        = useState([]);
  const [search,       setSearch]       = useState("");
  const [roleFilter,   setRoleFilter]   = useState("ALL");
  const [loading,      setLoading]      = useState(true);
  const [modal,        setModal]        = useState(null);          // "add" | "edit" | null
  const [form,         setForm]         = useState({ name: "", email: "", role: "VILLAGER" });
  const [deleteTarget, setDeleteTarget] = useState(null);

  // ── Fetch users (re-runs when roleFilter changes) ──
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = roleFilter === "ALL"
        ? await getUsers()
        : await getUsersByRole(roleFilter);
      setUsers(data);
    } catch {
      toast("Failed to load users", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [roleFilter]);

  // ── Derived list (client-side search only) ──
  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  // ── Handlers ──
  const openAdd  = () => { setForm({ name: "", email: "", role: "VILLAGER" }); setModal("add"); };
  const openEdit = (u) => { setForm({ ...u }); setModal("edit"); };

  const handleSave = async () => {
    if (!form.name || !form.email) { toast("Please fill all fields", "error"); return; }
    try {
      if (modal === "add") {
        await addUser({ name: form.name, email: form.email, role: form.role });
        toast("User added successfully");
      } else {
        await updateUser(form.id, { name: form.name, email: form.email, role: form.role });
        toast("User updated successfully");
      }
      setModal(null);
      fetchUsers();
    } catch {
      toast("Failed to save user", "error");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteUser(deleteTarget.id);
      toast("User deleted");
      setDeleteTarget(null);
      fetchUsers();
    } catch {
      toast("Failed to delete user", "error");
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="space-y-4">
      {/* ── Toolbar ── */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex gap-2 flex-wrap">
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search users..."
              className="pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 w-52"
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="ALL">All</option>
            <option value="VILLAGER">Villagers</option>
            <option value="OFFICER">Officers</option>
          </select>
        </div>

        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          <Plus size={16} /> Add User
        </button>
      </div>

      {/* ── Table ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {filtered.length === 0 ? (
          <EmptyState icon={Users} message="No users found" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  {["Name", "Email", "Role", "Status", "Actions"].map((h) => (
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
                {filtered.map((u) => (
                  <tr
                    key={u.id}
                    className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="px-4 py-3 font-medium text-slate-800">{u.name}</td>
                    <td className="px-4 py-3 text-slate-500">{u.email}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          u.role === "OFFICER"
                            ? "bg-indigo-100 text-indigo-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          u.status === "Active"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {u.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <button
                          onClick={() => openEdit(u)}
                          className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-500 hover:text-blue-700 transition-colors"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(u)}
                          className="p-1.5 rounded-lg hover:bg-red-50 text-red-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 size={14} />
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

      {/* ── Add / Edit Modal ── */}
      <Modal
        open={!!modal}
        onClose={() => setModal(null)}
        title={modal === "add" ? "Add New User" : "Edit User"}
      >
        <div className="space-y-4">
          {["name", "email"].map((field) => (
            <div key={field}>
              <label className="block text-sm font-medium text-slate-700 mb-1 capitalize">
                {field}
              </label>
              <input
                value={form[field] || ""}
                onChange={(e) => setForm((p) => ({ ...p, [field]: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ))}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
            <select
              value={form.role}
              onChange={(e) => setForm((p) => ({ ...p, role: e.target.value }))}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="VILLAGER">Villager</option>
              <option value="OFFICER">Officer</option>
            </select>
          </div>
          <div className="flex gap-3 justify-end pt-2">
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
              Save
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