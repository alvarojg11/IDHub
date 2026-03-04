import type { NextConfig } from 'next';
import createMDX from '@next/mdx';

const withMDX = createMDX({
  extension: /\.mdx?$/,
});

const ASSISTANT_BACKEND_ORIGIN =
  process.env.ASSISTANT_BACKEND_ORIGIN ?? 'https://assistantapi-production.up.railway.app';

const securityHeaders = [
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  {
    key: "X-XSS-Protection",
    value: "1; mode=block",
  },
];

const nextConfig: NextConfig = {
  pageExtensions: ['ts', 'tsx', 'md', 'mdx'],
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: '/health',
        destination: `${ASSISTANT_BACKEND_ORIGIN}/health`,
      },
      {
        source: '/assistant',
        destination: `${ASSISTANT_BACKEND_ORIGIN}/assistant`,
      },
      {
        source: '/v1/:path*',
        destination: `${ASSISTANT_BACKEND_ORIGIN}/v1/:path*`,
      },
    ];
  },
};

export default withMDX(nextConfig);
