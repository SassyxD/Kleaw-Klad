/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['tile.openstreetmap.org', 'server.arcgisonline.com'],
  },
  transpilePackages: ['lucide-react'],
}

module.exports = nextConfig
