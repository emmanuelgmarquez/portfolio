import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    // WebP only: AVIF softens small text in email screenshots.
    formats: ["image/webp"],
    qualities: [75, 90],
    deviceSizes: [640, 828, 1080, 1280, 1600, 1920, 2400],
  },
  async redirects() {
    return [
      // The brief referenced this case study as "ResortStay Connect"; the supplied
      // creative is branded Rialto, so the canonical route is /work/rialto.
      { source: "/work/resortstay-connect", destination: "/work/rialto", permanent: true },
    ];
  },
};

export default nextConfig;
