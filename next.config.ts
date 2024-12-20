import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

module.exports = {
  reactStrictMode: true,
  images: {
    domains: ['example.com', 'lh3.googleusercontent.com', 'cdn.pixabay.com', 'trivia-competitors-image-storage.s3.eu-north-1.amazonaws.com', 'avatars.githubusercontent.com'],
  },
}

export default nextConfig;
