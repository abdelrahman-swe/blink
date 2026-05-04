import { PUBLIC_API } from "@/lib/config";
import axios from "axios";
// @ts-ignore - js-cookie is installed but types might not be available
import Cookies from "js-cookie";

const GUEST_ID_KEY = "guest_id";

function getOrCreateGuestId(): string | undefined {
  // Only run in browser
  if (typeof window === "undefined") return undefined;

  let guestId = Cookies.get(GUEST_ID_KEY);

  if (!guestId) {
    // Prefer crypto.randomUUID when available
    if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
      guestId = crypto.randomUUID();
    } else {
      // Fallback unique-ish id
      guestId =
        Math.random().toString(36).substring(2) + Date.now().toString(36);
    }

    // Save for 1 year
    Cookies.set(GUEST_ID_KEY, guestId, { expires: 365 });
  }

  return guestId;
}

// You still can use this if you need baseURL somewhere else
const baseURL = process.env.NEXT_PUBLIC_API_URL
  ? `${process.env.NEXT_PUBLIC_API_URL}/api`
  : "/api";

const api = axios.create({
  baseURL: PUBLIC_API,
  withCredentials: true,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const method = config.method?.toUpperCase() ?? "GET";
    const url = `${config.baseURL ?? ""}${config.url ?? ""}`;

    // ---------- LOCALE HEADER ----------
    if (typeof window !== "undefined") {
      let locale: "en" | "ar" = "en";

      // 1) Try to read from URL: /en/... or /ar/...
      const pathLocale = window.location.pathname.split("/")[1];
      if (pathLocale && ["en", "ar"].includes(pathLocale)) {
        locale = pathLocale as "en" | "ar";
      } else {
        // 2) Fallback to cookie
        const cookieLocale = Cookies.get("NEXT_LOCALE");
        if (cookieLocale && ["en", "ar"].includes(cookieLocale)) {
          locale = cookieLocale as "en" | "ar";
        }
      }

      config.headers = config.headers ?? {};
      config.headers["X-Locale"] = locale;

      // ---------- GUEST ID HEADER ----------
      const guestId = getOrCreateGuestId();
      if (guestId) {
        config.headers["X-Guest-Id"] = guestId;
      }

      // ---------- AUTH HEADER ----------
      const token = Cookies.get("token");
      const isAuthEndpoint =
        url.includes("/auth/login") ||
        url.includes("/auth/register") ||
        url.includes("/auth/verify-account");

      if (token && !isAuthEndpoint) {
        config.headers["Authorization"] = `Bearer ${token}`;

        // Also inject token into body if it's an object (as requested to send with each endpoint)
        if (
          config.data &&
          typeof config.data === "object" &&
          !(config.data instanceof FormData)
        ) {
          // @ts-ignore
          config.data.token = token;
        }
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Only run in browser
      if (typeof window !== "undefined") {
        // Clear cookies
        Cookies.remove("token", { path: "/" });
        Cookies.remove("id", { path: "/" });
        Cookies.remove("full_name", { path: "/" });
        Cookies.remove("email", { path: "/" });
        Cookies.remove("phone", { path: "/" });

        // Redirect to login (middleware will handle locale if we go to just /login, but better to be explicit)
        const lang = Cookies.get("NEXT_LOCALE") || "en";
        window.location.href = `/${lang}/home`;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
export { getOrCreateGuestId };
