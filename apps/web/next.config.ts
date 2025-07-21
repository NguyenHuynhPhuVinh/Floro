import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Use Turbopack for faster builds with Konva.js compatibility
  turbopack: {
    // Configure resolve aliases for Konva.js compatibility
    resolveAlias: {
      // Alias canvas to empty module to prevent bundling issues
      canvas: require.resolve('./src/lib/empty-module.js'),
    },
  },

  // Keep webpack config as fallback for production builds (webpack is still used in production)
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
