import { useState } from "react";
import { Link } from "react-router-dom";
import { forgotPassword } from "../Services/authService";

const validateEmail = (v) => {
  if (!v.trim()) return "Email is required.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return "Enter a valid email address.";
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

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [apiError, setApiError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailError = validateEmail(email);
    setError(emailError);
    setApiError("");
    setSuccessMessage("");

    if (emailError) return;

    setLoading(true);
    try {
      const response = await forgotPassword({ email: email.trim() });
      setSuccessMessage(
        response?.message || "If this email is registered, a reset link has been sent."
      );
    } catch (err) {
      setApiError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Unable to process request. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-b from-[#f6f3ee] to-[#efe9e1] px-4">
      <div className="w-full max-w-md bg-[#fbf8f3] rounded-2xl shadow-xl p-8">
        <div className="flex flex-col items-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-[#1f5a3a] flex items-center justify-center text-xl mb-2">
            🔑
          </div>
          <h1 className="text-xl font-semibold text-[#1f5a3a] tracking-wide">DVMS</h1>
        </div>

        <h2 className="text-2xl font-semibold text-center text-[#3b2f2f]">Forgot Password</h2>
        <p className="text-center text-sm text-gray-500 mt-1 mb-6">
          Enter your email to receive a password reset link
        </p>

        {apiError && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3 flex items-center gap-2">
            <span>⚠️</span> {apiError}
          </div>
        )}

        {successMessage && (
          <div className="mb-4 bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg px-4 py-3 flex items-center gap-2">
            <span>✅</span> {successMessage}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit} noValidate>
          <Field icon="✉️" label="Email" error={error}>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
                setApiError("");
                setSuccessMessage("");
              }}
              className="w-full outline-none text-sm bg-transparent"
            />
          </Field>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-[#1f5a3a] hover:bg-[#17472e] disabled:opacity-60 disabled:cursor-not-allowed text-white py-3 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                Sending link...
              </>
            ) : (
              "Send Reset Link"
            )}
          </button>
        </form>

        <div className="text-center text-sm text-gray-500 mt-6 space-y-2">
          <p>
            Remembered your password?{" "}
            <Link to="/login" className="text-[#1f5a3a] font-semibold hover:underline">
              Back to Login
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
