import { toast } from "react-toastify";

/**
 * Enhanced Toast Notification Helper
 * Provides preconfigured notifications aligned with Biddyasetu theme.
 */

export const showSuccess = (message, options = {}) => {
  return toast.success(message, {
    ...options,
  });
};

export const showError = (message, options = {}) => {
  const displayMsg =
    typeof message === "string"
      ? message
      : message?.response?.data?.message ||
        message?.message ||
        "An unexpected error occurred.";

  return toast.error(displayMsg, {
    ...options,
  });
};

export const showInfo = (message, options = {}) => {
  return toast.info(message, {
    ...options,
  });
};

export const showWarning = (message, options = {}) => {
  return toast.warning(message, {
    ...options,
  });
};

export const showPromise = (promise, { pending, success, error }) => {
  return toast.promise(promise, {
    pending: pending || "Processing...",
    success: success || "Action completed successfully!",
    error: {
      render({ data }) {
        return (
          data?.response?.data?.message ||
          data?.message ||
          error ||
          "Action failed"
        );
      },
    },
  });
};

export { toast };
export default toast;
