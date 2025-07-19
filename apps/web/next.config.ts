import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    // Fix for Konva.js canvas dependency
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        canvas: false,
        fs: false,
      };
    }

    // Add externals to prevent bundling canvas
    config.externals = config.externals || [];
    if (Array.isArray(config.externals)) {
      config.externals.push('canvas');
    }

    return config;
  },
};

export default nextConfig;
