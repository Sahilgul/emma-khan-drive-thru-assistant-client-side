import { useState } from "react";
import type { FC } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { showError, showLoading } from "../../utils/alert";
import { useNavigate } from "react-router-dom";
import "./SignIn.css";
import { useAuth } from "../../hooks/useAuth";


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
    <div className="signin-container">
      <div className="signin-card">
        <div className="logo"></div>

        <h2 className="title">
          Sign in<span className="highlight"></span>
        </h2>
        <p className="subtitle">Sign in with your company account</p>

        {/* Wrap EVERYTHING inside a form for ENTER KEY support */}
        <form onSubmit={(e) => { e.preventDefault(); handleSignIn(); }}>
          {/* Email Field */}
          <div className="field">
            <label>Email</label>
            <input
              type="email"
              placeholder="input your email in here"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>

          {/* Password Field */}
          <div className="field password">
            <label>Password</label>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="input your password in here"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
            <span
              className="toggle-visibility"
              onClick={() => setShowPassword(!showPassword)}
            >
              <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
            </span>
          </div>

          <p className="forgot" onClick={() => navigate("/forgot-password")}>
            Forgot password?
          </p>

          <button
            type="submit"
            className="signin-btn"
            disabled={loading}
          >
            {loading ? "Please wait..." : "Sign in"}
          </button>

          {/* <p className="subtitle" style={{ marginTop: "16px" }}>
          Don't have an account?{" "}
          <span
            className="highlight"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/signup")}
          >
            Register Now
          </span>
        </p> */}
        </form>
      </div>
    </div>
  );
};

export default SignIn;

