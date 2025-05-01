import type { NextConfig } from 'next';

const isProd = process.env.NODE_ENV === 'production';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  trailingSlash: true,
  basePath: isProd ? '/pxiaccount/topping-timer/blob/main/public/stickers' : '',
  images: {
    unoptimized: true,
  }
};

export default nextConfig;