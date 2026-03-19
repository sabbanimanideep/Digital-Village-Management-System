import { Navigate } from "react-router-dom";
import {
  getDashboardPathByRole,
  getStoredRole,
  isAuthenticated,
} from "../Services/api";

export default function DashboardRedirect() {

  if (!isAuthenticated())
    return <Navigate to="/login" replace />;

  const role = getStoredRole();

  return (
    <Navigate
      to={getDashboardPathByRole(role)}
      replace
    />
  );
}