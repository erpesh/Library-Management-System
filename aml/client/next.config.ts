import type { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig = {
  // ... other configurations ...
  experimental: {
    turbo: {
      
    }
  },
  webpack: (config: any) => ({
    ...config,
    watchOptions: {
      ...config.watchOptions,
      poll: 1000,
      aggregateTimeout: 300,
    }
  }),
}

export default nextConfig;
