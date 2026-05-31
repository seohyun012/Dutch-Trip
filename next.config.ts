import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      { protocol: "http", hostname: "k.kakaocdn.net" },
      { protocol: "https", hostname: "k.kakaocdn.net" },
    ],
  },
};

export default nextConfig;
