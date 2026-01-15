import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { showSuccess, showError, showLoading } from "../../utils/alert";
import { authService } from "../../services/authService";
import logo from "/images/brand-logo.png";

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSendLink = async () => {
    if (!email.trim()) {
      showError("Please enter your email address.");
      return;
    }

    if (!validateEmail(email)) {
      showError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    showLoading("Sending password reset link...");

    try {
      const response = await authService.forgotPassword({ email });
      const { message, resetToken } = response.data;

      showSuccess(message || "Password reset link sent successfully!");

      // ✅ Navigate to recover-password with token from backend
      setTimeout(() => {
        navigate(`/recover-password?token=${encodeURIComponent(resetToken)}`);
      }, 1500);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("❌ Forgot password error:", error);
      const message =
        error.response?.data?.message ||
        error.response?.data?.detail ||
        "Failed to send password reset link. Try again!";
      showError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 relative overflow-hidden">
      {/* Animated Background Orbs */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-teal-200 rounded-full opacity-20 blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-200 rounded-full opacity-20 blur-3xl animate-pulse delay-1000" />

      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-10 relative z-10 mx-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 bg-teal-50 rounded-2xl flex items-center justify-center shadow-sm">
            <img src={logo} alt="Logo" className="w-10 h-auto" />
          </div>
        </div>

        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Forgot <span className="text-teal-600">Password</span>
          </h2>
          <p className="text-gray-500">Enter your email for account recovery</p>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); handleSendLink(); }} className="space-y-6">
          {/* Email Field */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 ml-1">Email Address</label>
            <input
              type="email"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 outline-none transition-all text-gray-700 bg-gray-50/50 hover:bg-white"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white rounded-xl font-bold text-lg shadow-lg shadow-teal-500/20 hover:shadow-teal-500/30 transform hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Sending...
              </span>
            ) : "Send Link"}
          </button>

          <div className="text-center pt-2">
            <p
              className="text-sm font-medium text-teal-600 hover:text-teal-700 cursor-pointer transition-colors hover:underline"
              onClick={() => navigate("/signin")}
            >
              Back to Sign In
            </p>
          </div>
        </form>
      </div>

      <div className="absolute bottom-6 text-center w-full text-gray-400 text-sm">
        © {new Date().getFullYear()} Emma AI. All rights reserved.
      </div>
    </div>
  );
};

export default ForgotPassword;
