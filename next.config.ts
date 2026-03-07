import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '15mb',
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.dicebear.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'th.bing.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'img.freepik.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
        pathname: '**',
      },
    ],
  },
  serverExternalPackages: ['firebase-admin'],
  async redirects() {
    return [
      {
        source: '/placement/:path*',
        destination: '/dashboard/placement/:path*',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
