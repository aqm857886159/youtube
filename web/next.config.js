 /** @type {import('next').NextConfig} */
  const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,

    // 安全配置
    async headers() {
      return [
        {
          source: '/:path*',
          headers: [
            {
              key: 'X-DNS-Prefetch-Control',
              value: 'on'
            },
            {
              key: 'Strict-Transport-Security',
              value: 'max-age=63072000; includeSubDomains; preload'
            },
            {
              key: 'X-Frame-Options',
              value: 'DENY'
            },
            {
              key: 'X-Content-Type-Options',
              value: 'nosniff'
            },
            {
              key: 'Referrer-Policy',
              value: 'strict-origin-when-cross-origin'
            },
            {
              key: 'Permissions-Policy',
              value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()'
            }
          ],
        },
      ]
    },

    env: {
      NEXT_PUBLIC_APP_NAME: 'YouTube AI Processor',
      NEXT_PUBLIC_APP_VERSION: '1.0.0',
    },

    compiler: {
      removeConsole: process.env.NODE_ENV === 'production',
    },

    images: {
      domains: [],
      formats: ['image/webp', 'image/avif'],
    },

    i18n: {
      locales: ['zh-CN', 'en'],
      defaultLocale: 'zh-CN',
    },

    webpack: (config, { dev, isServer }) => {
      if (!dev && !isServer) {
        config.optimization.splitChunks.chunks = 'all';
      }
      return config;
    }
  }

  module.exports = nextConfig
