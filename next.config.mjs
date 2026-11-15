/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: { ignoreDuringBuilds: true },
  images: {
    // Seed photos are self-hosted in /public/images; admins may still paste Unsplash URLs.
    // Swap for client photography (or a bucket/CDN) before going live.
    remotePatterns: [{ protocol: "https", hostname: "images.unsplash.com" }],
    unoptimized: true,
  },
};
export default nextConfig;
