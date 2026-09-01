import type { NextConfig } from "next";
import path from "path";
import { DUMMY_ASSET_CACHE_VERSION } from "./src/lib/dummy-asset-path";

const appRoot = path.resolve(__dirname);

const nextConfig: NextConfig = {
  transpilePackages: ["design-system"],
  outputFileTracingRoot: appRoot,
  turbopack: {
    root: appRoot,
  },
  images: {
    localPatterns: [
      { pathname: "/dummy-resource/**" },
      { pathname: "/dummy-resource/**", search: `?v=${DUMMY_ASSET_CACHE_VERSION}` },
      /** 내 작품 캐릭터 스플래시 (`public/characters/`) */
      { pathname: "/characters/**" },
      { pathname: "/frame-theme-thumbnails/**" },
      { pathname: "/notifications/**" },
      { pathname: "/prototype/work-detail/**" },
      { pathname: "/prototype/coin-events/**" },
    ],
    remotePatterns: [
      { protocol: "https", hostname: "github.com" },
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "no-store, max-age=0, must-revalidate",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
