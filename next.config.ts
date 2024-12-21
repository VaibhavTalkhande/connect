import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ['img.clerk.com', 'lh3.googleusercontent.com','clerk.com'],
  },
  reactStrictMode: false,
};

export default nextConfig;
