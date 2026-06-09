import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // CMS auto-generates content.ts — ignore type errors during build
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
