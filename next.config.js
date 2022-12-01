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
        has: [
          {
            type: "host",
            value: "paulify.vercel.app",
          },
        ],
        destination: "/paul",
      },
      {
        has: [
          {
            type: "host",
            value: "marinify.vercel.app",
          },
        ],
        destination: "/marie",
      },
    ];
  },
};

module.exports = nextConfig;
