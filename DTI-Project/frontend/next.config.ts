/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  turbopack: {
    root: __dirname,
  },
  async rewrites() {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

    return [
      {
        source: '/api/trpc/:path*',
        destination: `${backendUrl}/trpc/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
