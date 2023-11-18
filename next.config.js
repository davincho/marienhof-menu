/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    serverComponentsExternalPackages: ["libsql"],
    ppr: true,
  },
};

module.exports = nextConfig;
