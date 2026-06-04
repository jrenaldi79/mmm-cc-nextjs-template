/** @type {import('next').NextConfig} */

// Build allowedDevOrigins dynamically from Replit environment
const allowedDevOrigins = [
  'localhost',
  '127.0.0.1',
]

// Add Replit domains if available
if (process.env.REPLIT_DOMAINS) {
  allowedDevOrigins.push(process.env.REPLIT_DOMAINS)
}

const nextConfig = {
  reactStrictMode: true,
  compiler: {
    removeConsole: false,
  },
  // Allow Replit proxy domains and localhost for development
  allowedDevOrigins,
  // Allow all origins for Replit development
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig
