import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "blink.appclouders.com",
      },
    ],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Disable Next's image optimizer in development to avoid remote timeouts
    // (the optimizer fetches remote images server-side and can block page render)
    unoptimized: process.env.NODE_ENV !== "production",
  },
  reactStrictMode: false,

  async rewrites() {
    return [
      {
        source: "/api/sitemap/:path*",
        destination: "https://blink.appclouders.com/api/sitemap/:path*",
      },
    ];
  },
};

export default nextConfig;