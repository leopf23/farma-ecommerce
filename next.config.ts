import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "farmatrixstorage.blob.core.windows.net",
        pathname: "/farmatrix/**",
      },
    ],
  },
};

export default nextConfig;
