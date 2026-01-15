import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { useNavigate, useSearchParams } from "react-router-dom";
import { showSuccess, showError, showLoading } from "../../utils/alert";
import "./RecoverPassword.css";
import { authService } from "../../services/authService";

const RecoverPassword: React.FC = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false); // ✅ FIX: real state hook
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
    <div className="recover-container">
      <div className="recover-card">
        {/* Title */}
        <h2 className="title">
          Recover <span>Password</span>
        </h2>
        <p className="subtitle">Enter your new password</p>

        {/* Password Field */}
        <div className="field password-field">
          <label>Password</label>
          <div className="input-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="input your password in here"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span
              className="icon"
              onClick={() => setShowPassword(!showPassword)}
            >
              <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
            </span>
          </div>
        </div>

        {/* Confirm Password Field */}
        <div className="field password-field">
          <label>Confirm Password</label>
          <div className="input-wrapper">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <span
              className="icon"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              <FontAwesomeIcon
                icon={showConfirmPassword ? faEyeSlash : faEye}
              />
            </span>
          </div>
        </div>

        {/* Confirm Button */}
        <button
          className="confirm-btn"
          onClick={handleConfirm}
          disabled={loading}
        >
          {loading ? "Processing..." : "Confirm"}
        </button>
      </div>
    </div>
  );
};

export default RecoverPassword;
