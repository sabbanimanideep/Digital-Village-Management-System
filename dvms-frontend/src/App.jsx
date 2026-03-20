import { Navigate, Route, Routes } from "react-router-dom";

import "./App.css";
import Home from "./Home";

import DashboardRedirect from "./components/DashboardRedirect";
import ProtectedRoute from "./components/ProtectedRoute";

import { AuthProvider } from "./Context/AuthContext";

import AdminDashboard from "./Pages/AdminDashboard";
import CitizenDashboard from "./Pages/CitizenDashboard";
import OfficerDashboard from "./Pages/OfficerDashboard";

import ForgotPassword from "./Pages/ForgotPassword";
import Login from "./Pages/Login";
import Register from "./Pages/Register";

import CitizenAnnouncementsPage from "./Pages/Citiizenmenu/Citizenannouncementspage";
import ComplaintManagement from "./Pages/Citiizenmenu/Complaintmanagement";
import SchemesApplyPage from "./Pages/Citiizenmenu/Schemesapplypage";
import ComplaintsPage from "./Pages/Officermenu/Complaintspage ";
import SchemesPage from "./Pages/Officermenu/Schemespage";
import UsersPage from "./Pages/Officermenu/Userspage";


export default function App() {
  return (
    <AuthProvider>
      <Routes>

        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route path="/dashboard" element={<DashboardRedirect />} />

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/officer/complaints"
          element={
            <ProtectedRoute allowedRoles={["OFFICER"]}>
              <ComplaintsPage/>
            </ProtectedRoute>
          }
        />

        <Route
          path="/officer/users"
          element={
            <ProtectedRoute allowedRoles={["OFFICER"]}>
              <UsersPage/>
            </ProtectedRoute>
          }
        />

        <Route
          path="/officer/schemes"
          element={
            <ProtectedRoute allowedRoles={["OFFICER"]}>
              <SchemesPage/>
            </ProtectedRoute>
          }
        />

        <Route
          path="/officer/dashboard"
          element={
            <ProtectedRoute allowedRoles={["OFFICER"]}>
              <OfficerDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/citizen/dashboard"
          element={
            <ProtectedRoute allowedRoles={["CITIZEN"]}>
              <CitizenDashboard />
            </ProtectedRoute>
          }
        />

          <Route
            path="/citizen/complaints/new"
            element={
              <ProtectedRoute allowedRoles={["CITIZEN"]}>
                <ComplaintManagement />
              </ProtectedRoute>
            }
          />

          <Route
            path="/citizen/schemes/apply"
            element={
              <ProtectedRoute allowedRoles={["CITIZEN"]}>
                <SchemesApplyPage />
              </ProtectedRoute>
            }
          />

        <Route
          path="/citizen/announcements"
          element={
            <ProtectedRoute allowedRoles={["CITIZEN"]}>
              <CitizenAnnouncementsPage />
            </ProtectedRoute>
          }
        />
                    <Route
            path="/citizen/services/announcements"
            element={
              <ProtectedRoute allowedRoles={["CITIZEN"]}>
                <CitizenAnnouncementsPage />
              </ProtectedRoute>
            }
          />

          
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </AuthProvider>
  );
}
