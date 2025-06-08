import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  reactStrictMode: process.env.NODE_ENV !== 'production', // Strict mode in development
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'kdbxq6eseiqtwhzx.public.blob.vercel-storage.com', // Vercel's blob URL
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com', // GitHub's avatar URL
      },
      {
        protocol: 'https',
        hostname: 'cdn.intra.42.fr', // 42's avatar URL
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com', // Google's avatar URL
      },
      {
        protocol: 'https',
        hostname: 'image.tmdb.org', // TMDB's image URL
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/browse',
        permanent: true, // Permanent redirects send a 308 status
      },
    ];
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@aws-sdk/client-s3': false,
    };
    return config;
  },
};

export default withNextIntl(nextConfig);
