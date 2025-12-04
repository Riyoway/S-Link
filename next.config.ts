import withPWAInit from 'next-pwa';
import type { NextConfig } from 'next';

const withPWA = withPWAInit({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
  publicExcludes: ['!icons/**/*'],
  buildExcludes: [
    /client-manifest\.json$/,
    /server\/middleware-manifest\.json$/,
  ],
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'google-fonts-cache',
      },
    },
    {
      urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'gstatic-fonts-cache',
      },
    },
    {
      urlPattern: /^\/_next\/image\?url=.*/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'next-image-cache',
      },
    },
  ],
});

const nextConfig: NextConfig = {
  reactStrictMode: true,
};

// @ts-expect-error next-pwa types are incompatible with next 16
export default withPWA(nextConfig);
