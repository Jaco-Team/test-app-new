/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['storage.yandexcloud.net'],
  },
  experimental: {
    fontLoaders: [
      { loader: '@next/font/google', options: { weight: ['100', '300', '400', '500', '700', '900'], subsets: ['sans-serif'] } },
    ],
  },
}

module.exports = nextConfig
