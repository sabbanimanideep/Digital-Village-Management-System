import { Navigate } from "react-router-dom";
import {
  getDashboardPathByRole,
  getStoredRole,
  isAuthenticated,
} from "../Services/api";

export default function ProtectedRoute({
  allowedRoles,
  children,
}) {
  if (!isAuthenticated())
    return <Navigate to="/login" replace />;

  const role = getStoredRole()?.toUpperCase();
  console.log("Auth:", isAuthenticated());
  console.log("Role:", getStoredRole());
  console.log("Allowed roles:", allowedRoles);

  if (!allowedRoles.includes(role))
    return (
      <Navigate
        to={getDashboardPathByRole(role)}
        replace
      />
    );

  return children;
}