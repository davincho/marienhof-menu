/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  serverComponentsExternalPackages: ["libsql"],
  ppr: true,
  experimental: {
    reactCompiler: true,
  },
};

module.exports = nextConfig;
