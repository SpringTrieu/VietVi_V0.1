import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    qualities: [75, 85, 90, 95],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  },
  turbopack: {
    rules: {
      '*.css': {
        loaders: [require.resolve('@tailwindcss/turbopack')],
        as: '*.css',
      },
    },
  },
};

export default nextConfig;
