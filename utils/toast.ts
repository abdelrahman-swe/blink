import { toast as sonnerToast } from "sonner";
import { getApiErrorMessage } from "./getApiErrorMessage";

function extractBackendMessage(response: any): string | null {
  if (!response) return null;
  if (typeof response === "string") return response;

  // Handle Axios response structure
  if (response.data) {
    if (typeof response.data.message === "string" && response.data.message) {
      return response.data.message;
    }
    if (typeof response.data.description === "string" && response.data.description) {
      return response.data.description;
    }
  }

  // Handle direct message/description keys in response object
  if (typeof response === "object") {
    if (typeof response.message === "string" && response.message) {
      return response.message;
    }
    if (typeof response.description === "string" && response.description) {
      return response.description;
    }
  }

  return null;
}

export const toast = {
  success: (message: any, fallbackOrOptions?: string | any, options?: any) => {
    const backendMsg = extractBackendMessage(message);
    let fallback = "Operation completed successfully";
    let actualOptions = options;

    if (typeof fallbackOrOptions === "string") {
      fallback = fallbackOrOptions;
    } else if (fallbackOrOptions && typeof fallbackOrOptions === "object") {
      actualOptions = fallbackOrOptions;
      if (fallbackOrOptions.fallback) {
        fallback = fallbackOrOptions.fallback;
      }
    }

    const text = backendMsg || (typeof message === "string" ? message : fallback);
    return sonnerToast.success(text, actualOptions);
  },

  error: (error: any, fallbackOrOptions?: string | any, options?: any) => {
    let fallback = "Something went wrong";
    let actualOptions = options;

    if (typeof fallbackOrOptions === "string") {
      fallback = fallbackOrOptions;
    } else if (fallbackOrOptions && typeof fallbackOrOptions === "object") {
      actualOptions = fallbackOrOptions;
      if (fallbackOrOptions.fallback) {
        fallback = fallbackOrOptions.fallback;
      }
    }

    const text = typeof error === "string" ? error : getApiErrorMessage(error, fallback);
    return sonnerToast.error(text, actualOptions);
  },

  info: (message: any, fallbackOrOptions?: string | any, options?: any) => {
    const backendMsg = extractBackendMessage(message);
    let fallback = "Information";
    let actualOptions = options;

    if (typeof fallbackOrOptions === "string") {
      fallback = fallbackOrOptions;
    } else if (fallbackOrOptions && typeof fallbackOrOptions === "object") {
      actualOptions = fallbackOrOptions;
      if (fallbackOrOptions.fallback) {
        fallback = fallbackOrOptions.fallback;
      }
    }

    const text = backendMsg || (typeof message === "string" ? message : fallback);
    return sonnerToast.info(text, actualOptions);
  },

  warning: (message: any, fallbackOrOptions?: string | any, options?: any) => {
    const backendMsg = extractBackendMessage(message);
    let fallback = "Warning";
    let actualOptions = options;

    if (typeof fallbackOrOptions === "string") {
      fallback = fallbackOrOptions;
    } else if (fallbackOrOptions && typeof fallbackOrOptions === "object") {
      actualOptions = fallbackOrOptions;
      if (fallbackOrOptions.fallback) {
        fallback = fallbackOrOptions.fallback;
      }
    }

    const text = backendMsg || (typeof message === "string" ? message : fallback);
    return sonnerToast.warning(text, actualOptions);
  },

  // Forward helper/utility methods of sonner toast
  custom: sonnerToast.custom,
  dismiss: sonnerToast.dismiss,
  loading: sonnerToast.loading,
  promise: sonnerToast.promise,
};
