import toast from "react-hot-toast";

let loadingToastId: string | undefined;

export const showLoading = (msg: string) => {
  if (loadingToastId) toast.dismiss(loadingToastId);
  loadingToastId = toast.loading(msg);
  return loadingToastId;
};

export const showSuccess = (msg: string) => {
  if (loadingToastId) {
    toast.dismiss(loadingToastId);
    loadingToastId = undefined;
  }
  toast.success(msg);
};

export const showError = (msg: string) => {
  if (loadingToastId) {
    toast.dismiss(loadingToastId);
    loadingToastId = undefined;
  }
  toast.error(msg);
};

export const showWarning = (msg: string) =>
  toast(msg, {
    icon: "⚠️",
    style: {
      background: "#fff8e1",
      color: "#9f6000",
      border: "1px solid #ffecb3",
      boxShadow: "0 4px 16px rgba(255, 193, 7, 0.2)",
    },
  });

export const showInfo = (msg: string) =>
  toast(msg, {
    icon: "ℹ️",
    style: {
      background: "#e8f4ff",
      color: "#0277bd",
      border: "1px solid #b3e5fc",
      boxShadow: "0 4px 16px rgba(2, 119, 189, 0.2)",
    },
  });

