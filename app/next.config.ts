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
      { pathname: "/prototype/ranking/**" },
    ],
    remotePatterns: [
      { protocol: "https", hostname: "github.com" },
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
    ],
  },
  async rewrites() {
    return [
      /**
       * update-360 랭킹 시안 SPA (public/prototype/ranking)
       * 정적 파일(assets 등)은 public이 우선하고, 그 외 경로는 index.html로 폴백
       */
      {
        source: "/prototype/ranking",
        destination: "/prototype/ranking/index.html",
      },
      {
        source: "/prototype/ranking/:path*",
        destination: "/prototype/ranking/index.html",
      },
    ];
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
