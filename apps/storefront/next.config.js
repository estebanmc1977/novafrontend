// apps/storefront/next.config.js
const createNextIntlPlugin = require('next-intl/plugin')
const { withSentryConfig } = require('@sentry/nextjs')

const withNextIntl = createNextIntlPlugin('./i18n/request.ts')

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.clerk.com',
      },
    ],
  },

  // === CONFIGURACIONES IMPORTANTES PARA CODESPACES ===
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },

  // Ayuda con el error de x-forwarded-host en Codespaces
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'x-forwarded-host',
            value: 'localhost:3000',
          },
        ],
      },
    ]
  },
}

module.exports = withSentryConfig(
  withNextIntl(nextConfig),
  {
    org: process.env.SENTRY_ORG,
    project: process.env.SENTRY_PROJECT,
    silent: true,
    widenClientFileUpload: true,
    hideSourceMaps: true,
    autoInstrumentMiddleware: false,
  }
)