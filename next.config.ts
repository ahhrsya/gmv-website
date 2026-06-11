import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
  typescript: {
    // CMS auto-generates content.ts — ignore type errors during build
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
