/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['storage.yandexcloud.net', 'cdnimg.jacofood.ru'],
    minimumCacheTTL: 86400,
  },
  experimental: {
    fontLoaders: [
      { loader: 'next/font/google', options: { weight: ['100', '300', '400', '500', '700', '900'], subsets: ['latin'], variable: '--inter-font' } },
    ],
  },
}

module.exports = nextConfig
