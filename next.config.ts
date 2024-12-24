import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  reactStrictMode: process.env.NODE_ENV !== 'production', // Strict mode in development
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'kdbxq6eseiqtwhzx.public.blob.vercel-storage.com',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/dashboard',
        permanent: true, // Permanent redirects send a 308 status
      },
    ];
  },
};

export default withNextIntl(nextConfig);
