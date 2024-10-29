/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  serverComponentsExternalPackages: ["libsql"],
  ppr: true,
  experimental: {
    reactCompiler: true,
    dynamicIO: true,
  },
};

module.exports = nextConfig;
