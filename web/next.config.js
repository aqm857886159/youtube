/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  // 安全配置
  async headers() {
    return [
      {
        // 应用于所有路由
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
  
  // 环境变量配置
  env: {
    // 只有NEXT_PUBLIC_开头的变量会暴露给客户端
    NEXT_PUBLIC_APP_NAME: 'YouTube AI Processor',
    NEXT_PUBLIC_APP_VERSION: '1.0.0',
  },
  
  // 编译配置
  compiler: {
    // 生产环境移除console.log
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // 图片优化配置
  images: {
    domains: [], // 只允许特定域名的图片
    formats: ['image/webp', 'image/avif'],
  },
  
  // 重定向配置
  async redirects() {
    return [
      // 强制HTTPS (生产环境)
      process.env.NODE_ENV === 'production' ? {
        source: '/:path*',
        has: [
          {
            type: 'header',
            key: 'x-forwarded-proto',
            value: 'http',
          },
        ],
        destination: 'https://yourdomain.com/:path*',
        permanent: true,
      } : {},
    ].filter(Boolean)
  },
  
  // 国际化配置 (如果需要)
  i18n: {
    locales: ['zh-CN', 'en'],
    defaultLocale: 'zh-CN',
  },
  
  // Webpack配置
  webpack: (config, { dev, isServer }) => {
    // 生产环境优化
    if (!dev && !isServer) {
      config.optimization.splitChunks.chunks = 'all';
    }
    
    return config;
  },
  
  // 实验性功能
  experimental: {
    // 启用服务器组件 (如果使用 App Router)
  },
}

module.exports = nextConfig
