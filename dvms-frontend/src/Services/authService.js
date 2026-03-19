import axios from "axios";

// -- Base config ---------------------------------------------------------------
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8089/api",
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

// -- Request interceptor: attach JWT from localStorage ------------------------
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// -- Response interceptor: handle 401 globally --------------------------------
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// -- Auth helpers --------------------------------------------------------------
const saveSession = (data) => {
  localStorage.setItem("token", data.token);
  localStorage.setItem("user", JSON.stringify(data.user));
};

const clearSession = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("role");
};

/**
 * POST /api/auth/register
 * @param {{ name: string, email: string, password: string, role: string }} payload
 * @returns {{ token: string, user: object }}
 */
export const registerUser = async (payload) => {
  const { data } = await API.post("/auth/register", payload);
  saveSession(data);
  return data;
};

/**
 * POST /api/auth/login
 * @param {{ email: string, password: string }} payload
 * @returns {{ token: string, user: object }}
 */
export const loginUser = async (payload) => {
  const { data } = await API.post("/auth/login", payload);
  saveSession(data);
  return data;
};

/**
 * POST /api/auth/forgot-password
 * @param {{ email: string }} payload
 * @returns {{ message: string }}
 */
export const forgotPassword = async (payload) => {
  const { data } = await API.post("/auth/forgot-password", payload);
  return data;
};

/**
 * POST /api/auth/logout
 */
// authService.js — make sure it uses API instance, not plain axios
// authService.js — replace logoutUser
export const logoutUser = () => {
  clearSession(); // just clear localStorage, no backend call needed for JWT
};

/**
 * GET /api/auth/me  -- verify token & get current user
 * @returns {{ user: object }}
 */
export const getMe = async () => {
  const { data } = await API.get("/auth/me");
  return data;
};

// -- Session utilities (no network) -------------------------------------------
export const getToken = () => localStorage.getItem("token");
export const getUser = () => JSON.parse(localStorage.getItem("user") || "null");
export const isLoggedIn = () => Boolean(getToken());

export default API;
