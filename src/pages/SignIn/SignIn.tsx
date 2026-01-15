import { useState } from "react";
import type { FC } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { showError, showLoading } from "../../utils/alert";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import logo from "/images/brand-logo.png";


const SignIn: FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // Main Sign In Logic
  const handleSignIn = async () => {
    if (!email.trim()) return showError("Email is required!");
    if (!validateEmail(email)) return showError("Please enter a valid email!");
    if (!password.trim()) return showError("Password is required!");
    if (password.length < 6)
      return showError("Password must be at least 6 characters!");

    try {
      setLoading(true);
      showLoading("Signing in...");

      // Use context (handles token, expiry, localStorage, etc.)
      await login(email, password);

      navigate("/dashboard");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("Login failed:", err);

      if (err.response?.status === 401) {
        showError("Invalid email or password.");
      } else {
        const msg =
          err.response?.data?.message ||
          err.message ||
          "Something went wrong. Please try again.";
        showError(msg);
      }
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
            Welcome <span className="text-teal-600">Back</span>
          </h2>
          <p className="text-gray-500">Sign in to access your dashboard</p>
        </div>

        {/* Wrap EVERYTHING inside a form for ENTER KEY support */}
        <form onSubmit={(e) => { e.preventDefault(); handleSignIn(); }} className="space-y-6">
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

          {/* Password Field */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 ml-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
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

          <div className="flex justify-end">
            <p
              className="text-sm font-medium text-teal-600 hover:text-teal-700 cursor-pointer transition-colors hover:underline"
              onClick={() => navigate("/forgot-password")}
            >
              Forgot password?
            </p>
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
                Signing in...
              </span>
            ) : "Sign in"}
          </button>
        </form>
      </div>

      <div className="absolute bottom-6 text-center w-full text-gray-400 text-sm">
        © {new Date().getFullYear()} Emma AI. All rights reserved.
      </div>
    </div>
  );
};

export default SignIn;
