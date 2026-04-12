/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    turbopackFileSystemCacheForDev: true,
    serverActions: {
      bodySizeLimit: "20mb", // https://nextjs.org/docs/app/api-reference/next-config-js/serverActions#bodysizelimit
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.snapix.space",
      },
    ],
  },
  allowedDevOrigins: [
    "local-origin.dev",
    "*.local-origin.dev",
    "openvscode-3002.metalevel.tech",
    "openvscode-3001.metalevel.tech",
    "openvscode-3000.metalevel.tech",
    "localhost:3002",
    "localhost:3001",
    "localhost:3000",
    "localhost",
  ],
};

export default nextConfig;
