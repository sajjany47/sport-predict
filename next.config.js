/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'export',
  async rewrites() {
    // Only proxy on Vercel (Frontend) or local development. 
    // This prevents the Render backend from infinitely redirecting to itself.
    if (process.env.VERCEL || process.env.NODE_ENV === "development") {
      return [
        {
          source: "/api/:path*",
          destination: "https://sport-predict-aejs.onrender.com/api/:path*",
        },
      ];
    }
    return [];
  },
  reactStrictMode: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
};

module.exports = nextConfig;
