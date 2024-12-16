import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.module.rules.push({
      test: /\.mp3$/,
      type: 'asset/resource',
    });
    return config;
  },
  /* config options here */
};

export default nextConfig;


