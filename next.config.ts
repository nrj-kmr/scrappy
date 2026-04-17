import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'googleusercontent.com',
      },
      {
        // Adding HTTP just in case your mock/dummy data is using http instead of https
        protocol: 'http',
        hostname: 'googleusercontent.com',
      }
    ],
  }
};

export default nextConfig;
