import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    proxyClientMaxBodySize: "120mb",
  },
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: process.env.IMAGE_HOSTNAME || '',
        port: process.env.IMAGE_PORT || '',
        pathname: '/**',
      },
    ],
    // host.docker.internal이 172.17.0.1 등 사설 IP로 해석되어 SSRF 방지 로직에 차단되는 것을 방지 (로컬 개발 전용)
    dangerouslyAllowLocalIP: process.env.NODE_ENV !== 'production',

    // 이미지 최적화 설정
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60 * 60 * 24 * 365, // 1년 캐싱
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  async headers() {
    if (process.env.NODE_ENV !== 'production') {
      return [];
    }

    return [
      {
        source: '/:all*(svg|jpg|jpeg|png|gif|ico|webp|avif)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/_next/image/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.BASE_URL}/api/:path*`,
      },
    ];
  },
  reactCompiler: {
    compilationMode: 'annotation',
  },
};

export default nextConfig;
