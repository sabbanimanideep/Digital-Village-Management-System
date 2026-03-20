import { useState } from "react";
import AnnouncementsPage from "./Adminmenu/Announcementspage";
import ComplaintsPage from "./Adminmenu/Complaintspage";
import DashboardPage from "./Adminmenu/Dashboardpage";
import { Navbar, Sidebar } from "./Adminmenu/Layout";
import ReportsPage from "./Adminmenu/Reportspage";
import SchemesPage from "./Adminmenu/Schemespage";
import { Toast } from "./Adminmenu/Ui";
import UsersPage from "./Adminmenu/Userspage";
import { useToast } from "./Adminmenu/Usetoast";

const ROUTES = {
  "/admin/dashboard":     DashboardPage,
  "/admin/users":         UsersPage,
  "/admin/complaints":    ComplaintsPage,
  "/admin/schemes":       SchemesPage,
  "/admin/announcements": AnnouncementsPage,
  "/admin/reports":       ReportsPage,
};

// ─── APP SHELL ────────────────────────────────────────────────────────────────

export default function AdminDashboard() {
  const [currentPath,  setCurrentPath]  = useState("/admin/dashboard");
  const [sidebarOpen,  setSidebarOpen]  = useState(false);
  const { toasts, addToast, removeToast } = useToast();

  // Resolve the active page component (fall back to Dashboard for unknown paths)
  const PageComponent = ROUTES[currentPath] ?? DashboardPage;

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* ── Sidebar ── */}
      <Sidebar
        currentPath={currentPath}
        onNavigate={(path) => setCurrentPath(path)}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* ── Main content area ── */}
      <div className="md:ml-60 flex flex-col min-h-screen">
        <Navbar
          currentPath={currentPath}
          onMenuClick={() => setSidebarOpen(true)}
        />
        <main className="flex-1 p-4 md:p-6">
          {/* Pass the toast helper so pages can trigger notifications */}
          <PageComponent toast={addToast} />
        </main>
      </div>

      {/* ── Global toast stack ── */}
      <Toast toasts={toasts} removeToast={removeToast} />
    </div>
  );
}