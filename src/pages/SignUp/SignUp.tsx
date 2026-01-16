import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { showSuccess, showError, showLoading } from "../../utils/alert";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash, faCheckCircle, faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import { authService } from "../../services/authService";
import logo from "../../assets/logo.png";

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

  const [viewState, setViewState] = useState<"passcode" | "signup" | "waitlist">("passcode");
  const [passcode, setPasscode] = useState(["", "", "", "", "", ""]);
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

  const handlePasscodeChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newPasscode = [...passcode];
    newPasscode[index] = value.slice(-1);
    setPasscode(newPasscode);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`passcode-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !passcode[index] && index > 0) {
      const prevInput = document.getElementById(`passcode-${index - 1}`);
      prevInput?.focus();
    }
  };

  const verifyPasscode = async () => {
    const enteredCode = passcode.join("");
    try {
      setLoading(true);
      await authService.verifyPasscode(enteredCode);
      setViewState("signup");
      showSuccess("Welcome! Please complete your registration.");
    } catch (error: any) {
      if (error.response?.status === 429) {
        showError("Too many attempts. Please wait a minute before trying again.");
      } else {
        const message = error.response?.data?.detail || "Invalid passcode. Please try again or join the waitlist.";
        showError(message);
      }
      setPasscode(["", "", "", "", "", ""]);
      document.getElementById("passcode-0")?.focus();
    } finally {
      setLoading(false);
    }
  };

  // 💪 Password strength check
  const evaluatePasswordStrength = (password: string) => {
    if (!password) return setPasswordStrength({ label: "", color: "", level: 0 });

    let strength = { label: "Weak", color: "bg-red-500", level: 33 };

    const mediumRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{6,}$/;
    const strongRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;

    if (strongRegex.test(password))
      strength = { label: "Strong", color: "bg-teal-500", level: 100 };
    else if (mediumRegex.test(password))
      strength = { label: "Medium", color: "bg-amber-500", level: 66 };

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

      await authService.signup({
        ...formData,
        passcode: passcode.join(""),
      });

      showSuccess("Account created successfully! Please sign in.");
      setTimeout(() => navigate("/signin"), 1200);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("❌ Signup error:", error);
      if (error.response?.status === 429) {
        showError("Too many sign-up attempts. Please try again in an hour.");
      } else {
        const message =
          error.response?.data?.message || "Failed to create account. Please try again!";
        showError(message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 relative overflow-hidden py-10">
      {/* Animated Background Orbs */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-teal-200 rounded-full opacity-20 blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-200 rounded-full opacity-20 blur-3xl animate-pulse delay-1000" />

      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-8 md:p-10 relative z-10 mx-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex justify-center mb-8">
          <img src={logo} alt="Logo" className="w-16 h-auto" />
        </div>

        {viewState === "passcode" && (
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Early <span className="text-teal-600">Access</span> Only
            </h2>
            <p className="text-gray-500 mb-8">Please enter your invitation code to create an account</p>

            <div className="flex justify-center gap-2 mb-8">
              {passcode.map((digit, index) => (
                <input
                  key={index}
                  id={`passcode-${index}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handlePasscodeChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-14 text-center text-2xl font-bold border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 outline-none transition-all"
                />
              ))}
            </div>

            <button
              onClick={verifyPasscode}
              className="w-full py-4 bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white rounded-xl font-bold text-lg shadow-lg shadow-teal-500/20 hover:shadow-teal-500/30 transform hover:-translate-y-0.5 transition-all mb-6"
            >
              Verify Code
            </button>

            <div className="space-y-4">
              <p className="text-gray-500 text-sm">
                Don't have a code?{" "}
                <button
                  onClick={() => setViewState("waitlist")}
                  className="text-teal-600 hover:text-teal-700 font-semibold hover:underline"
                >
                  Join the Waitlist
                </button>
              </p>
              <button
                onClick={() => navigate("/signin")}
                className="text-gray-400 hover:text-gray-600 text-sm font-medium"
              >
                Back to Sign In
              </button>
            </div>
          </div>
        )}

        {viewState === "waitlist" && (
          <div className="text-center py-10">
            <div className="mb-6">
              <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FontAwesomeIcon icon={faCheckCircle} className="text-teal-600 text-4xl" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">You're on the Waitlist!</h2>
              <p className="text-gray-600 max-w-sm mx-auto leading-relaxed">
                You are added to the waitlist and we would get back to you.
              </p>
            </div>

            <button
              onClick={() => setViewState("passcode")}
              className="mt-4 text-teal-600 hover:text-teal-700 font-semibold flex items-center justify-center gap-2 mx-auto"
            >
              <span>Have a code?</span>
              <span className="text-sm">Enter it here</span>
            </button>
          </div>
        )}

        {viewState === "signup" && (
          <>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Create your <span className="text-teal-600">account</span>
              </h2>
              <p className="text-gray-500">Fill in the details to get started</p>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 ml-1">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    placeholder="John"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 outline-none transition-all text-gray-700 bg-gray-50/50 hover:bg-white"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 ml-1">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Doe"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 outline-none transition-all text-gray-700 bg-gray-50/50 hover:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 ml-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="john@company.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 outline-none transition-all text-gray-700 bg-gray-50/50 hover:bg-white"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 ml-1">Company Name</label>
                  <input
                    type="text"
                    name="companyName"
                    placeholder="Company Inc."
                    value={formData.companyName}
                    onChange={handleChange}
                    className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 outline-none transition-all text-gray-700 bg-gray-50/50 hover:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 ml-1">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleChange}
                      onFocus={() => evaluatePasswordStrength(formData.password)}
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

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 ml-1">Confirm Password</label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={handleChange}
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
              </div>

              {/* Password Strength & Tips */}
              {passwordStrength.label && (
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-xs font-bold uppercase tracking-wider ${passwordStrength.color.replace('bg-', 'text-')}`}>
                      {passwordStrength.label} Password
                    </span>
                    <span className="text-xs text-slate-400">{passwordStrength.level}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${passwordStrength.color} transition-all duration-300`}
                      style={{ width: `${passwordStrength.level}%` }}
                    ></div>
                  </div>

                  {formData.password && (
                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div className={`flex items-center gap-2 text-xs ${/[A-Z]/.test(formData.password) ? "text-teal-600" : "text-slate-400"}`}>
                        <FontAwesomeIcon icon={/[A-Z]/.test(formData.password) ? faCheckCircle : faTimesCircle} />
                        One uppercase letter
                      </div>
                      <div className={`flex items-center gap-2 text-xs ${/[a-z]/.test(formData.password) ? "text-teal-600" : "text-slate-400"}`}>
                        <FontAwesomeIcon icon={/[a-z]/.test(formData.password) ? faCheckCircle : faTimesCircle} />
                        One lowercase letter
                      </div>
                      <div className={`flex items-center gap-2 text-xs ${/\d/.test(formData.password) ? "text-teal-600" : "text-slate-400"}`}>
                        <FontAwesomeIcon icon={/\d/.test(formData.password) ? faCheckCircle : faTimesCircle} />
                        One number
                      </div>
                      <div className={`flex items-center gap-2 text-xs ${/[!@#$%^&*]/.test(formData.password) ? "text-teal-600" : "text-slate-400"}`}>
                        <FontAwesomeIcon icon={/[!@#$%^&*]/.test(formData.password) ? faCheckCircle : faTimesCircle} />
                        One special char
                      </div>
                      <div className={`flex items-center gap-2 text-xs ${formData.password.length >= 8 ? "text-teal-600" : "text-slate-400"}`}>
                        <FontAwesomeIcon icon={formData.password.length >= 8 ? faCheckCircle : faTimesCircle} />
                        Min 8 characters
                      </div>
                    </div>
                  )}
                </div>
              )}


              <button
                onClick={handleSignUp}
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white rounded-xl font-bold text-lg shadow-lg shadow-teal-500/20 hover:shadow-teal-500/30 transform hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none mt-2"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating Account...
                  </span>
                ) : "Create Account"}
              </button>

              <p className="text-center text-sm font-medium text-gray-500">
                Already have an account?{" "}
                <span
                  className="text-teal-600 hover:text-teal-700 cursor-pointer hover:underline transition-colors"
                  onClick={() => navigate("/signin")}
                >
                  Sign in
                </span>
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SignUp;
