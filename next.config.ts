import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Allow larger uploads through middleware
  experimental: {
    serverActions: {
      bodySizeLimit: '50mb',
    },
    proxyClientMaxBodySize: '50mb',
  },
};

export default nextConfig;
