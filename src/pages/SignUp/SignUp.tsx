import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { showSuccess, showError, showLoading } from "../../utils/alert";
import "./SignUp.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { authService } from "../../services/authService";

const SignUp: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    companyName: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<{
    label: string;
    color: string;
    level: number;
  }>({ label: "", color: "", level: 0 });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (name === "password") evaluatePasswordStrength(value);
  };

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // 💪 Password strength check
  const evaluatePasswordStrength = (password: string) => {
    if (!password) return setPasswordStrength({ label: "", color: "", level: 0 });

    let strength = { label: "Weak", color: "var(--danger-color)", level: 33 };

    const mediumRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{6,}$/;
    const strongRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;

    if (strongRegex.test(password))
      strength = { label: "Strong", color: "var(--secondary-color)", level: 100 };
    else if (mediumRegex.test(password))
      strength = { label: "Medium", color: "var(--secondary-hover)", level: 66 };

    setPasswordStrength(strength);
  };

  const handleSignUp = async () => {
    const { firstName, lastName, email, companyName, password, confirmPassword } = formData;
  
    if (!firstName || !lastName || !email || !companyName || !password || !confirmPassword) {
      showError("Please fill in all fields!");
      return;
    }
  
    if (!validateEmail(email)) {
      showError("Please enter a valid email address!");
      return;
    }
  
    if (password.length < 8) {
      showError("Password must be at least 8 characters long!");
      return;
    }
  
    if (password !== confirmPassword) {
      showError("Passwords do not match!");
      return;
    }
  
    try {
      setLoading(true);
      showLoading("Creating your account...");

      await authService.signup(formData);

      showSuccess("Account created successfully! Please sign in.");
      setTimeout(() => navigate("/signin"), 1200);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("❌ Signup error:", error);
      const message =
        error.response?.data?.message || "Failed to create account. Please try again!";
      showError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <div className="logo"></div>

        <h2 className="title">
          Create your <span className="highlight"></span> account
        </h2>
        <p className="subtitle">Fill in the details to get started</p>

        <div className="row">
          <div className="field">
            <label>First Name</label>
            <input
              type="text"
              name="firstName"
              placeholder="John"
              value={formData.firstName}
              onChange={handleChange}
            />
          </div>
          <div className="field">
            <label>Last Name</label>
            <input
              type="text"
              name="lastName"
              placeholder="Doe"
              value={formData.lastName}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="row">
          <div className="field">
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="john@company.com"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div className="field">
            <label>Company Name</label>
            <input
              type="text"
              name="companyName"
              placeholder="Company Inc."
              value={formData.companyName}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="row">
        <div className="field password">
            <label>Password</label>
            <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            onFocus={() => evaluatePasswordStrength(formData.password)}
            onBlur={() => setPasswordStrength({ label: "", color: "", level: 0 })}
            />
            <span
            className="toggle-visibility"
            onClick={() => setShowPassword(!showPassword)}
            >
            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
            </span>
        </div>

        <div className="field password">
            <label>Confirm Password</label>
            <input
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            placeholder="••••••••"
            value={formData.confirmPassword}
            onChange={handleChange}
            />
            <span
            className="toggle-visibility"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
            <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
            </span>
        </div>
        </div>
        <div className="row">
            <div className="tooltip">
            {passwordStrength.label && (
                <>
                    <p
                    className="password-strength-text"
                    style={{ color: passwordStrength.color }}
                    >
                    {passwordStrength.label} password
                    </p>
                    <div className="password-strength-bar">
                    <div
                        className="password-strength-fill"
                        style={{
                        width: `${passwordStrength.level}%`,
                        backgroundColor: passwordStrength.color,
                        }}
                    ></div>
                    </div>
                </>
                )}

            {/* 💬 Tooltip with live tips */}
            
           
            {formData.password && (
            <div>
                 <h4>Password must be!</h4>
                 <div className="password-tips">
                 <ul>
                <li className={/[A-Z]/.test(formData.password) ? "met" : "unmet"}>
                    Include at least one uppercase letter
                </li>
                <li className={/[a-z]/.test(formData.password) ? "met" : "unmet"}>
                    Include lowercase letters
                </li>
                <li className={/\d/.test(formData.password) ? "met" : "unmet"}>
                    Include at least one number
                </li>
                <li className={/[!@#$%^&*]/.test(formData.password) ? "met" : "unmet"}>
                    Include a special character (!@#$%^&*)
                </li>
                <li className={formData.password.length >= 8 ? "met" : "unmet"}>
                    At least 8 characters long
                </li>
                </ul>
                 </div>
                
            </div>
            )}
            </div>
            <div className="tooltip"></div>
        </div>


        <button className="signin-btn mt-4" onClick={handleSignUp} disabled={loading}>
          {loading ? "Please wait..." : "Create Account"}
        </button>

        <p className="subtitle" style={{ marginTop: "16px" }}>
          Already have an account?{" "}
          <span
            className="highlight"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/")}
          >
            Sign in
          </span>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
