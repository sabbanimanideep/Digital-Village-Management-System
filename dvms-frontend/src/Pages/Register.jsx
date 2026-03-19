import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../Services/authService";

const ROLES = [
  { label: "Villager", value: "VILLAGER" }
];

// ── Validation helpers ─────────────────────────────────────────────────────────
const validateFullName = (v) => {
  if (!v.trim()) return "Full name is required.";
  if (v.trim().length < 3) return "Name must be at least 3 characters.";
  if (!/^[a-zA-Z\s'-]+$/.test(v.trim())) return "Name can only contain letters, spaces, hyphens, or apostrophes.";
  return "";
};

const validateEmail = (v) => {
  if (!v.trim()) return "Email is required.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return "Enter a valid email address.";
  return "";
};

const validatePassword = (v) => {
  if (!v) return "Password is required.";
  if (v.length < 6) return "Password must be at least 6 characters.";
  if (!/[A-Z]/.test(v)) return "Password must contain at least one uppercase letter.";
  if (!/[0-9]/.test(v)) return "Password must contain at least one number.";
  return "";
};

// ── Reusable field wrapper ─────────────────────────────────────────────────────
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

// ── Register page ──────────────────────────────────────────────────────────────
export default function Register() {
  const navigate = useNavigate();

  const [form, setForm]         = useState({ fullName: "", email: "", password: "", role: "Villager" });
  const [errors, setErrors]     = useState({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading]   = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const set = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
    setApiError("");
  };

  const setRole = (role) => {
    setForm((prev) => ({ ...prev, role }));
  };

  const validate = () => {
    const e = {
      fullName: validateFullName(form.fullName),
      email:    validateEmail(form.email),
      password: validatePassword(form.password),
    };
    setErrors(e);
    return !Object.values(e).some(Boolean);
  };

  // Live password strength indicator
  const passwordStrength = () => {
    const p = form.password;
    if (!p) return null;
    let score = 0;
    if (p.length >= 6)      score++;
    if (p.length >= 10)     score++;
    if (/[A-Z]/.test(p))   score++;
    if (/[0-9]/.test(p))   score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
    if (score <= 2) return { label: "Weak",   color: "bg-red-400",    width: "w-1/4"  };
    if (score <= 3) return { label: "Fair",   color: "bg-yellow-400", width: "w-2/4"  };
    if (score <= 4) return { label: "Good",   color: "bg-blue-400",   width: "w-3/4"  };
    return               { label: "Strong", color: "bg-green-500",  width: "w-full" };
  };

  const strength = passwordStrength();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setApiError("");
    try {
      await registerUser({
        name:     form.fullName.trim(),
        email:    form.email.trim(),
        password: form.password,
        role:     form.role,
      });
      navigate("/", { replace: true });
    } catch (err) { 
      setApiError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-b from-[#f6f3ee] to-[#efe9e1] px-4 py-10">
      <div className="w-full max-w-md bg-[#fbf8f3] rounded-2xl shadow-xl p-8">

        {/* Logo */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-[#1f5a3a] flex items-center justify-center text-xl mb-2">
            🏠
          </div>
          <h1 className="text-xl font-semibold text-[#1f5a3a] tracking-wide">DVMS</h1>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-semibold text-center text-[#3b2f2f]">Create Account</h2>
        <p className="text-center text-sm text-gray-500 mt-1 mb-6">
          Register to access government services
        </p>

        {/* API error banner */}
        {apiError && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3 flex items-center gap-2">
            <span>⚠️</span> {apiError}
          </div>
        )}

        {/* Form */}
        <form className="space-y-4" onSubmit={handleSubmit} noValidate>

          {/* Full Name */}
          <Field icon="👤" label="Full Name" error={errors.fullName}>
            <input
              type="text"
              placeholder="Enter your full name"
              value={form.fullName}
              onChange={set("fullName")}
              className="w-full outline-none text-sm bg-transparent"
            />
          </Field>

          {/* Email */}
          <Field icon="✉️" label="Email" error={errors.email}>
            <input
              type="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={set("email")}
              className="w-full outline-none text-sm bg-transparent"
            />
          </Field>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div
              className={`flex items-center gap-2 border rounded-lg px-3 py-2 bg-white transition-all
                focus-within:ring-2 ${errors.password ? "border-red-400 focus-within:ring-red-200" : "focus-within:ring-[#1f5a3a]/30"}`}
            >
              <span className="text-gray-400 shrink-0">🔒</span>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={form.password}
                onChange={set("password")}
                className="w-full outline-none text-sm bg-transparent"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="text-gray-400 hover:text-gray-600 text-xs shrink-0 transition-colors"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
            {/* Strength bar */}
            {strength && !errors.password && (
              <div className="mt-2">
                <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all duration-300 ${strength.color} ${strength.width}`} />
                </div>
                <p className={`text-xs mt-1 font-medium ${
                  strength.label === "Weak"   ? "text-red-500"    :
                  strength.label === "Fair"   ? "text-yellow-600" :
                  strength.label === "Good"   ? "text-blue-600"   : "text-green-600"
                }`}>
                  {strength.label} password
                </p>
              </div>
            )}
          </div>

          {/* Role selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Register As</label>
            <div className="flex gap-2">
              {ROLES.map((r) => (
              <button
                key={r.value}
                type="button"
                onClick={() => setRole(r.value)}           // sends "VILLAGER" / "OFFICER" to backend
                className={`flex-1 py-2 rounded-xl border text-sm font-medium transition-colors ${
                  form.role === r.value
                    ? "border-[#1f5a3a] text-[#1f5a3a] bg-white shadow-sm"
                    : "border-gray-200 text-gray-500 bg-[#f5f2ed] hover:border-gray-300"
                }`}
              >
                {r.label}                                  {/* displays "Villager" / "Officer" */}
              </button>
            ))}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 bg-[#1f5a3a] hover:bg-[#17472e] disabled:opacity-60 disabled:cursor-not-allowed text-white py-3 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                Creating account…
              </>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500 mt-6 space-y-2">
          <p>
            Already have an account?{" "}
            <Link to="/login" className="text-[#1f5a3a] font-semibold hover:underline">
              Login
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
