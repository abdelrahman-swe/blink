import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "blink.appclouders.com",
      },
    ],
    unoptimized: true, // Important for Netlify
  },
  reactStrictMode: false,
  // No additional config needed for proxy.ts
};

export default nextConfig;