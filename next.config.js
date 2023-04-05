/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compiler: {
    emotion: true,
  },
  images: {
    domains: ['picsum.photos'],
  },
  // // TODO: 추후 배포하게 될 시 수정 필요
  // siteUrl: process.env.SITE_URL || 'https://example.com',
  // generateRobotsTxt: true, // (optional)
  // // ...other options
}

module.exports = nextConfig
