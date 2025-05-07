//const MillionLint = require('@million/lint');
/** @type {import('next').NextConfig} */

//const { withAxiom } = require('next-axiom');

const nextConfig = {
  trailingSlash: false,
  reactStrictMode: true,
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
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
      {
        protocol: 'https',
        hostname: 'yacdn.jacofood.ru',
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
      {
        // Захватываем все пути
        source: '/:path*',
        // Условие: если хост равен "www.example.com"
        has: [
          {
            type: 'host',
            value: 'www.jacofood.ru',
          },
        ],
        // Редиректим на домен без "www", сохраняя путь
        destination: 'https://jacofood.ru/:path*',
        // Постоянный редирект (HTTP 301)
        permanent: true,
      },
    ]
  },
  async headers() {
    return [
      {
        // matching all API routes
        source: "/:path*",
        headers: [
            { key: "Access-Control-Allow-Credentials", value: "true" },
            { key: "Access-Control-Allow-Origin", value: "*" }, // replace this your actual origin
            { key: "Access-Control-Allow-Methods", value: "GET,DELETE,PATCH,POST,PUT" },
            { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version" },
            { key: "Cross-Origin-Opener-Policy", value: "same-origin" }
        ]
      }
    ]
}
}

/*const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})*/

// module.exports = MillionLint.next()(withAxiom(nextConfig));
//module.exports = withAxiom(nextConfig);



// Injected content via Sentry wizard below

//const { withSentryConfig } = require("@sentry/nextjs");
module.exports = nextConfig
// module.exports = withSentryConfig(
//   nextConfig,
//   module.exports,
//   {
//     // For all available options, see:
//     // https://github.com/getsentry/sentry-webpack-plugin#options

//     org: "sentry",
//     project: "jacofood-react",
//     sentryUrl: "https://sentry.jacochef.ru/",

//     // Only print logs for uploading source maps in CI
//     silent: !process.env.CI,

//     telemetry: false,
//     // For all available options, see:
//     // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

//     // Upload a larger set of source maps for prettier stack traces (increases build time)
//     widenClientFileUpload: true,

//     // Automatically annotate React components to show their full name in breadcrumbs and session replay
//     reactComponentAnnotation: {
//       enabled: true,
//     },

//     // Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
//     // This can increase your server load as well as your hosting bill.
//     // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
//     // side errors will fail.
//     tunnelRoute: "/monitoring",

//     // Hides source maps from generated client bundles
//     hideSourceMaps: true,

//     // Automatically tree-shake Sentry logger statements to reduce bundle size
//     disableLogger: true,

//     // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
//     // See the following for more information:
//     // https://docs.sentry.io/product/crons/
//     // https://vercel.com/docs/cron-jobs
//     automaticVercelMonitors: true,
//   }
// );