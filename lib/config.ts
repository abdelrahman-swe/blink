// utils/config.ts

// Public base URL (browser + client-side axios)
export const PUBLIC_API_BASE =
  process.env.NEXT_PUBLIC_API_URL ?? "https://blink.appclouders.com";

// Server-only base URL (optional override)
export const SERVER_API_BASE =
  process.env.BACKEND_URL ?? PUBLIC_API_BASE;

// Full API endpoints (always ends in /api)
export const PUBLIC_API = `${PUBLIC_API_BASE}/api`;
export const SERVER_API = `${SERVER_API_BASE}/api`;
