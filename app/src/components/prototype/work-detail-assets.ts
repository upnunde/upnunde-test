/** Figma `2:32` 프로토타입 정적 에셋 — `public/prototype/work-detail/` */
export const WORK_DETAIL_ASSET_BASE = "/prototype/work-detail";

export const WORK_DETAIL_IMAGES = {
  heroBackground: `${WORK_DETAIL_ASSET_BASE}/hero-background.jpg`,
  cover: `${WORK_DETAIL_ASSET_BASE}/cover.jpg`,
  episodes: [
    `${WORK_DETAIL_ASSET_BASE}/episode-1.jpg`,
    `${WORK_DETAIL_ASSET_BASE}/episode-2.jpg`,
    `${WORK_DETAIL_ASSET_BASE}/episode-3.jpg`,
    `${WORK_DETAIL_ASSET_BASE}/episode-4.jpg`,
    `${WORK_DETAIL_ASSET_BASE}/episode-5.jpg`,
    `${WORK_DETAIL_ASSET_BASE}/episode-6.jpg`,
  ],
} as const;

/** Figma node-id → 파일명 (export 스크립트와 공유) */
export const WORK_DETAIL_FIGMA_NODES = [
  { nodeId: "2:33", file: "hero-background.jpg" },
  { nodeId: "2:36", file: "cover.jpg" },
  { nodeId: "2:66", file: "episode-1.jpg" },
  { nodeId: "2:68", file: "episode-2.jpg" },
  { nodeId: "2:70", file: "episode-3.jpg" },
  { nodeId: "2:72", file: "episode-4.jpg" },
  { nodeId: "2:74", file: "episode-5.jpg" },
  { nodeId: "2:76", file: "episode-6.jpg" },
] as const;
