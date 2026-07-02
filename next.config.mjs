/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: { ignoreDuringBuilds: true },
  images: {
    // Product photos are hotlinked from the Unsplash CDN for the demo.
    // Swap for client photography (or a bucket/CDN) before going live.
    remotePatterns: [{ protocol: "https", hostname: "images.unsplash.com" }],
    unoptimized: true,
  },
};
export default nextConfig;
