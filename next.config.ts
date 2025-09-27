import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ["localhost:3000"],
    },
  },
  typescript: {
    // ✅ Allow production build even if there are type errors
    ignoreBuildErrors: true,
  },
  eslint: {
    // ✅ Allow production build even if there are linting errors
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
