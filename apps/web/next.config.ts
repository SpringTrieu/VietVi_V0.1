import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
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
