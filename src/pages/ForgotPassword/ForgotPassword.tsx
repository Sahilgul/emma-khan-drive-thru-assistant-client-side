import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { showSuccess, showError, showLoading } from "../../utils/alert";
import "./ForgotPassword.css";
import { authService } from "../../services/authService";

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
    <div className="forgot-container">
      <div className="forgot-card">
        {/* Logo */}
        <div className="logo"></div>

        {/* Title */}
        <h2 className="title">
          Forgot <span>Password</span>
        </h2>
        <p className="subtitle">Enter your email for account recovery</p>

        {/* Email Field */}
        <div className="field">
          <label>Email</label>
          <input
            type="email"
            placeholder="input your email in here"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Send Link Button */}
        <button className="send-btn" onClick={handleSendLink}>
          {loading ? "Sending..." : "Send Link"}
        </button>

        {/* Resend Link */}
        {/* <p
          className="resend-link"
          onClick={() => navigate("/")}
        >
          Resend Link
        </p> */}
      </div>
    </div>
  );
};

export default ForgotPassword;
