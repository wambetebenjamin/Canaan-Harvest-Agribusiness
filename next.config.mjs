/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,

  // NOTE: `allowedDevOrigins` is only available from Next 15.2. This project
  // pins 15.1.0 per the build brief, and 15.1.0 does not restrict dev origins,
  // so the preview proxy host reaches the dev server without extra config.

  // Remote patterns kept open for the Pexels/Unsplash swap-in documented in
  // docs/PHOTO-SHOT-LIST.md. Photos are served from /public/photos today.
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: 'images.pexels.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
    deviceSizes: [320, 390, 480, 640, 768, 1024, 1280, 1440, 1920],
    imageSizes: [48, 64, 96, 128, 200, 256, 384],
  },

  // The MDX blog reads from the filesystem at request/build time.
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(self), microphone=(), geolocation=(self)' },
        ],
      },
      {
        // Immutable hashed font/asset caching; @fontsource files land here.
        source: '/_next/static/(.*)',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
    ];
  },
};

export default nextConfig;
