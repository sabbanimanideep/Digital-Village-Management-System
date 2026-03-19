import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
// ✅ API LOGIN (backend call)
import { login as apiLogin } from "../Services/api";
// ✅ Auth Context
import { useAuth } from "../Context/AuthContext";
import { getDashboardPathByRole, getRoleFromAuthPayload, saveAuthSession } from "../Services/api";


const validateEmail = (value) => {
  if (!value.trim()) return "Email is required.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Enter a valid email address.";
  return "";
};

const validatePassword = (value) => {
  if (!value) return "Password is required.";
  if (value.length < 6) return "Password must be at least 6 characters.";
  return "";
};

function Field({ icon, label, error, children }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div
        className={`flex items-center gap-2 border rounded-lg px-3 py-2 bg-white transition-all
          focus-within:ring-2 ${error ? "border-red-400 focus-within:ring-red-200" : "focus-within:ring-[#1f5a3a]/30"}`}
      >
        <span className="text-gray-400 shrink-0">{icon}</span>
        {children}
      </div>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);

  const set = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
    setApiError("");
  };

  const validate = () => {
    const nextErrors = {
      email: validateEmail(form.email),
      password: validatePassword(form.password),
    };
    setErrors(nextErrors);
    return !Object.values(nextErrors).some(Boolean);
  };

const handleSubmit = async (event) => {
  event.preventDefault();
  if (!validate()) return;

  setLoading(true);
  setApiError("");

  try {
    const response = await apiLogin({
      email: form.email.trim(),
      password: form.password,
    });


    const payload  = response.data; // { success, message, data: { token, user, ... } }

    // ✅ Save to localStorage
    saveAuthSession(payload);

    // ✅ Update AuthContext
    login(payload);

    // ✅ Redirect based on role
    const role = getRoleFromAuthPayload(payload);
    const path = getDashboardPathByRole(role);
    navigate(path, { replace: true });

  } catch (error) {
    setApiError(error.response?.data?.message || "Login failed");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-b from-[#f6f3ee] to-[#efe9e1] px-4">
      <div className="w-full max-w-md bg-[#fbf8f3] rounded-2xl shadow-xl p-8">
        <div className="flex flex-col items-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-[#1f5a3a] flex items-center justify-center text-xl mb-2">
            🏠
          </div>
          <h1 className="text-xl font-semibold text-[#1f5a3a] tracking-wide">DVMS</h1>
        </div>

        <h2 className="text-2xl font-semibold text-center text-[#3b2f2f]">Login</h2>
        <p className="text-center text-sm text-gray-500 mt-1 mb-6">
          Sign in to access your account
        </p>

        {apiError && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3 flex items-center gap-2">
            <span>⚠️</span> {apiError}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit} noValidate>
          <Field icon="✉️" label="Email" error={errors.email}>
            <input
              type="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={set("email")}
              className="w-full outline-none text-sm bg-transparent"
            />
          </Field>

          <Field icon="🔒" label="Password" error={errors.password}>
            <input
              type="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={set("password")}
              className="w-full outline-none text-sm bg-transparent"
            />
          </Field>

          <div className="text-right -mt-1">
            <Link to="/forgot-password" className="text-xs text-[#1f5a3a] font-medium hover:underline">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 bg-[#1f5a3a] hover:bg-[#17472e] disabled:opacity-60 disabled:cursor-not-allowed text-white py-3 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                Signing in...
              </>
            ) : (
              "Login"
            )}
          </button>
        </form>

        <div className="text-center text-sm text-gray-500 mt-6 space-y-2">
          <p>
            Don't have an account?{" "}
            <Link to="/register" className="text-[#1f5a3a] font-semibold hover:underline">
              Create Account
            </Link>
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-1 text-gray-500 hover:text-gray-700 transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
