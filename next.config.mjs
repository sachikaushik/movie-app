/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        hostname: 'placehold.co',
      },
      {
        hostname: 'huntington.org',
      },
      {
        hostname: 'avatarfiles.alphacoders.com',
      },
      {
        hostname: 'mybucket4862024.s3.amazonaws.com',
      },
    ],
  },
};

export default nextConfig;
