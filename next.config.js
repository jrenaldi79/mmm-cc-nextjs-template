/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  compiler: {
    removeConsole: false,
  },
  experimental: {
    // Trust the system certificate store when Turbopack makes outbound
    // requests (e.g. next/font/google fetching Google Fonts at build time).
    // Required in environments that route traffic through a TLS-intercepting
    // proxy, such as Claude Code's cloud sandbox.
    turbopackUseSystemTlsCerts: true,
  },
};

module.exports = nextConfig;
