/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    appDir: true,
  },
  rewrites: async () => {
    return [
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "paulify.vercel.app",
          },
        ],
        destination: "/paul",
      },
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "marienify.vercel.app",
          },
        ],
        destination: "/marie",
      },
    ];
  },
};

module.exports = nextConfig;
