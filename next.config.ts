import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  assetPrefix: process.env.NODE_ENV === 'production' ? undefined : '',
  // Make sure we're using the correct base path
  basePath: '',
  // Ensure proper hostname handling for development
  experimental: {
    // This ensures correct asset paths even when ports change
    webpackBuildWorker: true,
  },
};

export default nextConfig;
