import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    optimizePackageImports: ['@mantine/core', '@mantine/hooks'],
  },
  env: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    AUTH_SECRET: process.env.AUTH_SECRET,
  }
};

export default nextConfig;
