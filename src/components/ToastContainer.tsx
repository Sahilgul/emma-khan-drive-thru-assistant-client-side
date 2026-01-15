import React from "react";
import { Toaster } from "react-hot-toast";

export const ToastContainer: React.FC = () => (
  <Toaster
    position="top-center"
    toastOptions={{
      style: {
        borderRadius: "12px",
        background: "#ffffff",
        color: "#333",
        fontFamily: "Poppins, sans-serif",
        fontSize: "15px",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
        padding: "14px 20px",
      },
      success: {
        style: {
          background: "#f3fff0",
          color: "#2e7d32",
          border: "1px solid #a5d6a7",
        },
        iconTheme: {
          primary: "#4caf50",
          secondary: "#ffffff",
        },
      },
      error: {
        style: {
          background: "#fff5f5",
          color: "#d32f2f",
          border: "1px solid #ffcdd2",
        },
        iconTheme: {
          primary: "#d32f2f",
          secondary: "#ffffff",
        },
      },
      loading: {
        style: {
          background: "linear-gradient(135deg, #f7f9fb 0%, #eaf3ff 100%)",
          color: "#0056d2",
          fontWeight: 500,
          border: "1px solid #d0e3ff",
          boxShadow: "0 4px 18px rgba(0, 123, 255, 0.12)",
        },
        iconTheme: {
          primary: "#0056d2",
          secondary: "#ffffff",
        },
      },
    }}
  />
);
