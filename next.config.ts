import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  reactStrictMode: false, // Disable React Strict Modecd
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
        permanent: true,
      },
    ];
  },
};

export default withNextIntl(nextConfig);
