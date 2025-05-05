/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    serverActions: true,
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.html$/,
      use: 'html-loader',
    });
    return config;
  },
  // Hydration sorunlarını çözmek için
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Preload sorunlarını çözmek için
  poweredByHeader: false,
  // CSS modülleri için
  cssModules: true,
  cssLoaderOptions: {
    importLoaders: 1,
    localIdentName: '[local]___[hash:base64:5]',
  },
}

module.exports = nextConfig
