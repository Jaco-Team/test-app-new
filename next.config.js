/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['storage.yandexcloud.net', 'cdnimg.jacofood.ru'],
    minimumCacheTTL: 86400,
  },
  experimental: {
    
  },
}

module.exports = nextConfig
