/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['storage.yandexcloud.net', 'cdnimg.jacofood.ru'],
    minimumCacheTTL: 86400,
  },
  experimental: {
    
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/togliatti',
        permanent: false,
      },
    ]
  },
}

module.exports = nextConfig
