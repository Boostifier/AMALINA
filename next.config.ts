import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Product/category image uploads flow through Server Actions, so the
    // request body can exceed the default 1MB cap.
    serverActions: {
      bodySizeLimit: "8mb",
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "yejjunqopyijdzbozmrg.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
