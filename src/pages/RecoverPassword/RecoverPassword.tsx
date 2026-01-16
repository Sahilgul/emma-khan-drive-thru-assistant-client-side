import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { useNavigate, useSearchParams } from "react-router-dom";
import { showSuccess, showError, showLoading } from "../../utils/alert";
import { authService } from "../../services/authService";
import logo from "/images/brand-logo.png";

const RecoverPassword: React.FC = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const rawToken = token ? decodeURIComponent(token) : "";
  const navigate = useNavigate();

  const handleConfirm = async () => {
    if (!password || !confirmPassword) {
      showError("Please fill in both password fields.");
      return;
    }
    if (password.length < 8) {
      showError("Password must be at least 8 characters long.");
      return;
    }
    if (password !== confirmPassword) {
      showError("Passwords do not match.");
      return;
    }
    if (!rawToken) {
      showError("Reset token missing. Please use the link from your email.");
      return;
    }

    setLoading(true);
    showLoading("Resetting your password...");

    try {
      const response = await authService.resetPassword({
        token: rawToken,
        newPassword: password,
        confirmPassword,
      });

      showSuccess(response.data?.message || "Password reset successful!");
      setTimeout(() => navigate("/signin"), 1500);
    } catch (error: any) {
      console.error("❌ Reset password error:", error);
      const message =
        error.response?.data?.message ||
        error.response?.data?.detail ||
        "Failed to reset password. Try again!";
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
          <img src={logo} alt="Logo" className="w-16 h-auto" />
        </div>

        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Recover <span className="text-teal-600">Password</span>
          </h2>
          <p className="text-gray-500">Enter your new password below</p>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); handleConfirm(); }} className="space-y-6">
          {/* Password Field */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 ml-1">New Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 outline-none transition-all text-gray-700 bg-gray-50/50 hover:bg-white pr-12"
              />
              <span
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-teal-600 cursor-pointer transition-colors p-1"
                onClick={() => setShowPassword(!showPassword)}
              >
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
              </span>
            </div>
          </div>

          {/* Confirm Password Field */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 ml-1">Confirm Password</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={loading}
                className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 outline-none transition-all text-gray-700 bg-gray-50/50 hover:bg-white pr-12"
              />
              <span
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-teal-600 cursor-pointer transition-colors p-1"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
              </span>
            </div>
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
                Resetting...
              </span>
            ) : "Reset Password"}
          </button>
        </form>
      </div>

      <div className="absolute bottom-6 text-center w-full text-gray-400 text-sm">
        © {new Date().getFullYear()} Emma AI. All rights reserved.
      </div>
    </div>
  );
};

export default RecoverPassword;
