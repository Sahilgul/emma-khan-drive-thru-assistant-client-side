import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Home } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { AuthContext } from "../../contexts/AuthContext";

const NotFound: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const auth = useContext(AuthContext);

  const handleGoBack = () => {
    // Check if there's a previous page in the history stack
    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1); // Go back to the previous route
    } else if (auth?.isAuthenticated) {
      navigate("/dashboard"); // Fallback if logged in
    } else {
      navigate("/"); // Fallback to landing if not logged in
    }
  };

  const handleHomeRedirect = () => {
    isAuthenticated ? navigate("/dashboard") : navigate("/");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#020617] text-center px-6 overflow-hidden">
      {/* Animated 404 */}
      <motion.h1
        initial={{ opacity: 0, y: -40, scale: 0.8 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="text-9xl font-extrabold text-[#6366F1] drop-shadow-[0_0_20px_rgba(99,102,241,0.3)]"
      >
        404
      </motion.h1>

      {/* Subtitle */}
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="text-2xl font-semibold text-[#F8FAFC] mt-4"
      >
        Page Not Found
      </motion.h2>

      {/* Description */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="text-[#94A3B8] mt-3 max-w-md"
      >
        Sorry, the page you’re looking for doesn’t exist or may have been moved.
        You can go back or head to your main dashboard.
      </motion.p>

      {/* Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.6 }}
        className="flex gap-3 mt-8"
      >
        <button
          onClick={handleGoBack}
          className="flex items-center gap-2 bg-[#1E293B] text-[#E2E8F0] px-5 py-2 rounded-lg hover:bg-[#334155] border border-white/10 transition font-medium shadow-sm"
        >
          <ArrowLeft size={18} /> Go Back
        </button>

        <button
          onClick={handleHomeRedirect}
          className="flex items-center gap-2 bg-[#6366F1] hover:bg-[#4F46E5] text-white px-5 py-2 rounded-lg transition font-medium shadow-[0_4px_15px_rgba(99,102,241,0.4)]"
        >
          <Home size={18} />
          {isAuthenticated ? "Go to Dashboard" : "Go to Home"}
        </button>
      </motion.div>

      {/* Decorative SVG */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.15 }}
        transition={{ delay: 1.2, duration: 1 }}
        className="mt-12"
      >
        <svg
          width="160"
          height="160"
          viewBox="0 0 24 24"
          fill="none"
          className="text-[#6366F1] mx-auto opacity-50"
        >
          <path
            d="M12 2L2 7l10 5 10-5-10-5z"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <path
            d="M2 17l10 5 10-5M2 12l10 5 10-5"
            stroke="currentColor"
            strokeWidth="1.5"
          />
        </svg>
      </motion.div>
    </div>
  );
};

export default NotFound;
