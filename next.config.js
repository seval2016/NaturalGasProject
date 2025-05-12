/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['localhost'],
  },
  poweredByHeader: false,
  env: {
    NEXTAUTH_URL: 'http://localhost:3000',
    NEXTAUTH_SECRET: 'your-secret-key-here',
  },
  experimental: {
    serverActions: true,
  },
}

module.exports = nextConfig
