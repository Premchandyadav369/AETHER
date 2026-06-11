/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Allow iframes to load local HTML files from public directory
  async headers() {
    return [
      {
        source: '/visualizations/:path*',
        headers: [
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
        ],
      },
    ]
  },
}

module.exports = nextConfig
