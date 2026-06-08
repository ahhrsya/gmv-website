import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // CMS auto-generates content.ts — ignore type errors during build
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
