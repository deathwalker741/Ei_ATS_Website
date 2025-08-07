/** @type {import('next').NextConfig} */
// CodeRabbit V2 Review: Configuration analysis for optimization recommendations
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Allow cross-origin requests in development
  allowedDevOrigins: [
    '192.168.0.111',
    'localhost',
    '127.0.0.1'
  ],
  // Add headers for video files
  async headers() {
    return [
      {
        source: '/media/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
        ],
      },
      {
        source: '/media/:path*.mp4',
        headers: [
          {
            key: 'Content-Type',
            value: 'video/mp4',
          },
          {
            key: 'Accept-Ranges',
            value: 'bytes',
          },
        ],
      },
    ]
  },
}

export default nextConfig
