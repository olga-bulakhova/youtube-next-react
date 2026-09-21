import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: [new URL('https://img.youtube.com/**'), new URL('https://i.ytimg.com/**')],
  },
};

export default nextConfig;
