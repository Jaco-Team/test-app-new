/** @type {import('next').NextConfig} */

const { withAxiom } = require('next-axiom');

const nextConfig = {
  trailingSlash: false,
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

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

module.exports = withAxiom(nextConfig)
//module.exports = withBundleAnalyzer(nextConfig)
//module.exports = nextConfig
