/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compiler: {
    emotion: true,
  },
  images: {
    domains: [
      'picsum.photos',
      'gateway.ipfscdn.io', // thirdweb의 ipfs 사진에 대한 도메인 수락
    ],
  },
  // next/image를 설정할 시 위와 같이 사진에 대한 도메인을 일일히 설정해줘야 한다. next/image가 아니라 일반적인 image를 쓰면 된다.
  // // TODO: 추후 배포하게 될 시 수정 필요
  // siteUrl: process.env.SITE_URL || 'https://example.com',
  // generateRobotsTxt: true, // (optional)
  // // ...other options
};

module.exports = nextConfig;
