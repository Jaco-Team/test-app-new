/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'storage.yandexcloud.net',
        port: '',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'cdnimg.jacofood.ru',
        port: '',
        pathname: '**',
      },
    ],
    minimumCacheTTL: 86400,
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
