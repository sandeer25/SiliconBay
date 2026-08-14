import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    const dest = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/siliconbay/api";

    return [
      {
        source: "/api/backend/:path*",
        destination: `${dest}/:path*`,
      },
    ];
  },
};

export default nextConfig;