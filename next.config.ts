import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

module.exports = {
  reactStrictMode: true,
  images: {
    domains: ['example.com', 'lh3.googleusercontent.com', 'cdn.pixabay.com'],
  },
}

export default nextConfig;
