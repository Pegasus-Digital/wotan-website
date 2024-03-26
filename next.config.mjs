/** @type {import('next').NextConfig} */

const nextConfig = {
  images: {
    // Remember to add deploy server url to remotePatterns
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'https',
        hostname: 'source.unsplash.com',
      },
    ],
  },
}

export default nextConfig
