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
  // Externalize Payload CMS and its Node.js dependencies for server components
  // These packages use Node.js-specific features (like require.extensions) 
  // that cannot be bundled by webpack
  serverComponentsExternalPackages: [
    'payload',
    'express',
    '@payloadcms/bundler-webpack',
    '@payloadcms/db-mongodb',
    '@payloadcms/plugin-nested-docs',
    '@payloadcms/plugin-search',
    '@payloadcms/plugin-seo',
    '@payloadcms/richtext-lexical',
    '@payloadcms/richtext-slate',
  ],
  webpack: (config, { isServer }) => {
    // Additional webpack configuration for server-side builds
    if (isServer) {
      // Ensure Payload and Express are not bundled
      config.externals = [
        ...(Array.isArray(config.externals) ? config.externals : []),
        'payload',
        'express',
        /^@payloadcms\/.*/,
      ]
    }
    
    return config
  },
}

export default nextConfig
