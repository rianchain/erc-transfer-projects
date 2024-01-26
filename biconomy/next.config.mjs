import { config } from 'process';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer}) => {
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        net: false,
        tsl: false,
      };
    }
    return config;
  },
};

export default nextConfig;
