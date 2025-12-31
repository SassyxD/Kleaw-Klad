import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // Enable experimental features
  experimental: {
    optimizePackageImports: ['lucide-react', 'recharts'],
  },

  // Environment variables
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
    NEXT_PUBLIC_MAPTILER_KEY: process.env.NEXT_PUBLIC_MAPTILER_KEY,
    NEXT_PUBLIC_HUAWEI_CLOUD_ENDPOINT: process.env.NEXT_PUBLIC_HUAWEI_CLOUD_ENDPOINT,
  },

  // Image optimization
  images: {
    domains: ['api.maptiler.com', 'tile.openstreetmap.org'],
  },

  // Webpack configuration for MapLibre
  webpack: (config) => {
    config.module.rules.push({
      test: /\.mjs$/,
      include: /node_modules/,
      type: 'javascript/auto',
    });
    return config;
  },
};

export default nextConfig;
