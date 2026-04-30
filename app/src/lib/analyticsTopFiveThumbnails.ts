import {
  initialBackgrounds,
  initialCharacters,
  initialGallery,
  initialMedia,
  initialScenes,
} from "@/lib/resourceMockData";

/** `AnalyticsTopFiveRow.tone`과 동일 */
export type AnalyticsTopFiveThumbnailTone =
  | "series"
  | "character"
  | "seriesBlue"
  | "scenario";

const FALLBACK_THUMB = "/background-1.png";

function hashString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h * 31 + s.charCodeAt(i)) >>> 0;
  }
  return h;
}

function mediaThumbs(): string[] {
  return initialMedia.map((m) => m.thumbnailUrl).filter(Boolean);
}

function seriesLikeImagePool(): string[] {
  const bg = initialBackgrounds.map((i) => i.imageUrl);
  const gal = initialGallery.map((i) => i.imageUrl);
  const media = mediaThumbs();
  return [...bg, ...gal, ...media];
}

function scenarioImagePool(): string[] {
  const scenes = initialScenes.map((i) => i.imageUrl);
  const gal = initialGallery.map((i) => i.imageUrl);
  const media = mediaThumbs();
  return [...scenes, ...gal, ...media];
}

/**
 * 리소스 목업에서 행 단위로 결정론적으로 썸네일 URL 선택 (SSR/CSR 일치, 행마다 다른 이미지).
 * - 시리즈 계열: 배경·갤러리·영상 썸네일
 * - 캐릭터: 등록 캐릭터 대표 이미지
 * - 상황공략: 연출·갤러리·영상 썸네일
 */
export function getAnalyticsTopFiveThumbnailUrl(input: {
  rank: number;
  title: string;
  tone: AnalyticsTopFiveThumbnailTone;
}): string {
  const seed = `${input.rank}\0${input.title}\0${input.tone}`;
  const h = hashString(seed);

  if (input.tone === "character") {
    const list = initialCharacters;
    if (list.length === 0) return FALLBACK_THUMB;
    return list[h % list.length]!.imageUrl;
  }

  if (input.tone === "scenario") {
    const pool = scenarioImagePool();
    if (pool.length === 0) return FALLBACK_THUMB;
    return pool[h % pool.length]!;
  }

  const pool = seriesLikeImagePool();
  if (pool.length === 0) return FALLBACK_THUMB;
  return pool[h % pool.length]!;
}
