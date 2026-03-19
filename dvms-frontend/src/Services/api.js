import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8089/api",
  headers: {
    "Content-Type": "application/json",
  },
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const normalizeRole = (roleValue) => {
  if (!roleValue) return "";
  const normalized = String(roleValue).trim().toUpperCase();
  if (["ADMIN", "SUPER_ADMIN", "SUPERADMIN"].includes(normalized)) return "ADMIN";
  if (["OFFICER", "STAFF", "EMPLOYEE"].includes(normalized)) return "OFFICER";
  if (["CITIZEN", "VILLAGER", "MEMBER", "USER"].includes(normalized)) return "CITIZEN";
  return normalized;
};

const extractRole = (source) => {
  if (!source) return "";

  const directRole = normalizeRole(source.role || source.userRole || source.user_type || source.userType);
  if (directRole) return directRole;

  if (Array.isArray(source.roles)) {
    for (const value of source.roles) {
      const role =
        typeof value === "string"
          ? normalizeRole(value)
          : normalizeRole(value?.role || value?.name || value?.authority);
      if (role) return role;
    }
  }

  return "";
};

export const getRoleFromAuthPayload = (payload) => {
  if (!payload) return "";

  const candidates = [
    payload,
    payload.user,
    payload.data,
    payload.data?.user,
    payload.result,
    payload.result?.user,
  ];

  for (const candidate of candidates) {
    const role = extractRole(candidate);
    if (role) return role;
  }

  return "";
};

export const getDashboardPathByRole = (roleValue) => {
  const role = normalizeRole(roleValue);
  if (role === "ADMIN") return "/admin/dashboard";
  if (role === "OFFICER") return "/officer/dashboard";
  return "/citizen/dashboard";
};

export const saveAuthSession = (payload) => {
  const token = payload?.token || "";
  const user = payload?.user || payload?.data?.user || payload?.result?.user || {};
  const role = getRoleFromAuthPayload(payload);

  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify({ ...user, role }));
  localStorage.setItem("role", role);
};

export const clearAuthSession = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("role");
};

export const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    return null;
  }
};

export const getStoredRole = () => {
  const user = getStoredUser();
  const role =
    localStorage.getItem("role") ||
    user?.role ||
    user?.userRole ||
    user?.user_type ||
    user?.userType;
  return normalizeRole(role);
};

export const isAuthenticated = () => Boolean(localStorage.getItem("token"));

// ✅ CORRECT - uses your configured API instance
export const login = async (data) => {
  return API.post("/auth/login", data);
};

export const logout = () => {
  clearAuthSession();
};

export const fetchAdminDashboard = async () => {
  const { data } = await API.get("/admin/dashboard");
  return data;
};

export const fetchOfficerDashboard = async () => {
  const { data } = await API.get("/officer/dashboard");
  return data;
};

export const fetchCitizenDashboard = async () => {
  const { data } = await API.get("/citizen/dashboard");
  return data;
};

export default API;
