/**
 * Extracts a user-friendly error message from an API error response.
 * Falls back to the provided default message if the API doesn't provide one.
 * Works with Axios errors regardless of bundler/module setup.
 */
export function getApiErrorMessage(error: unknown, fallback: string): string {
  // Handle Axios-like errors (works even if instanceof AxiosError fails due to bundler)
  if (error && typeof error === "object") {
    const axiosErr = error as any;
    const apiMessage = axiosErr?.response?.data?.message;
    if (typeof apiMessage === "string" && apiMessage.length > 0) {
      return apiMessage;
    }
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}
