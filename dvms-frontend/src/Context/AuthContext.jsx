import { createContext, useContext, useState } from "react";

export const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {

  // Restore session on refresh
const [user, setUser] = useState(() => {
  try {
    return JSON.parse(localStorage.getItem("user")) || null;
  } catch {
    return null;
  }
});

  /* ---------- LOGIN ---------- */
const login = (data) => {
  const token = data?.token || data?.data?.token;

  const user =
    data?.user ||
    data?.data?.user ||
    data?.data;

  const role =
    user?.role ||
    user?.userRole ||
    user?.user_type ||
    data?.data?.role;

  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify({ ...user, role }));
  localStorage.setItem("role", role);

  setUser({ ...user, role });
};

  /* ---------- LOGOUT ---------- */
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");

    setUser(null);
  };

  /* ---------- HELPERS ---------- */
  const isAuthenticated = () => {
    return !!localStorage.getItem("token");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};