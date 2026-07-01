import { DUMMY_BACKGROUND_GALLERY_THUMBNAILS } from "@/lib/dummy-thumbnail-images";
import { DEMO_SERIES_IDS, createMockSeriesRecords } from "@/lib/series-mock-seed";
import type { Episode } from "@/types/episode";

const RESOURCE_THUMBNAIL_IMAGES = DUMMY_BACKGROUND_GALLERY_THUMBNAILS;

/** SSR/CSR 동일 — Math.random 금지(하이드레이션 불일치 방지) */
function deterministicViews(episodeNumber: number, seriesSalt = 0): number {
  return 100 + ((episodeNumber * 7919 + 12345 + seriesSalt * 9973) % 4901);
}

function seriesNumericSalt(seriesId: string): number {
  let hash = 0;
  for (const ch of seriesId) {
    hash = (hash * 31 + ch.charCodeAt(0)) >>> 0;
  }
  return hash % 10000;
}

function deterministicThumbnail(episodeNumber: number, seriesId: string): string {
  const salt = seriesNumericSalt(seriesId);
  const idx =
    Math.abs((episodeNumber * 1103515245 + 12345 + salt) % RESOURCE_THUMBNAIL_IMAGES.length) %
    RESOURCE_THUMBNAIL_IMAGES.length;
  return RESOURCE_THUMBNAIL_IMAGES[idx]!;
}

function buildEpisodeDate(episodeNumber: number, seriesId: string): string {
  const salt = seriesNumericSalt(seriesId);
  const baseDate = new Date(2024, (salt % 6) as number, 1);
  baseDate.setDate(baseDate.getDate() + (episodeNumber - 1) * 2);
  return baseDate.toISOString().slice(0, 10);
}

/** 1~120화 풀 데모 (시리즈 1 — 페이지네이션·상태 혼합 검증용) */
export function buildFullMockEpisodes(): Episode[] {
  const episodes: Episode[] = [];

  for (let n = 1; n <= 120; n++) {
    const episodeNumber = n;
    const isSpecial = n >= 116 && n <= 120;
    const title = isSpecial
      ? (n === 116 && "작성 중인 에피소드") ||
        (n === 117 && "기억의 늪에 빠진 로맨스") ||
        (n === 118 && "잊혀진 과거의 그림자") ||
        (n === 119 && "운명의 갈림길에서") ||
        (n === 120 && "빛과 그림자") ||
        `에피소드 ${n}화`
      : `에피소드 ${n}화`;

    episodes.push({
      id: n,
      episodeNumber,
      title,
      thumbnail: deterministicThumbnail(n, "1"),
      date: buildEpisodeDate(n, "1"),
      views: deterministicViews(n),
      status: "PUBLISHED",
    });
  }

  const overrides: Partial<Episode>[] = [
    {
      episodeNumber: 116,
      title: "작성 중인 에피소드",
      date: "2026-01-20",
      views: 320,
      status: "PUBLISHED",
    },
    {
      episodeNumber: 117,
      title: "기억의 늪에 빠진 로맨스",
      date: "2026-01-01",
      views: 890,
      status: "PUBLISHED",
    },
    {
      episodeNumber: 118,
      title: "잊혀진 과거의 그림자",
      date: "2025-12-12",
      views: 1205,
      status: "PUBLISHED",
    },
    {
      episodeNumber: 119,
      title: "운명의 갈림길에서",
      date: "2026-06-19",
      views: 0,
      status: "SCHEDULED",
      scheduledPublishAt: "2026-06-19T15:00:00",
    },
    {
      episodeNumber: 120,
      title: "새벽의 문턱에서",
      date: "2026-01-15",
      views: 0,
      status: "PRIVATE",
      scheduledPublishAt: null,
    },
    {
      episodeNumber: 121,
      title: "빛과 그림자",
      date: "",
      views: 0,
      status: "DRAFT",
    },
  ];

  for (const o of overrides) {
    const idx = episodes.findIndex((e) => e.episodeNumber === o.episodeNumber);
    if (idx !== -1) {
      episodes[idx] = { ...episodes[idx], ...o };
    } else {
      const base = episodes[0];
      if (!base) continue;
      episodes.push({
        ...base,
        id: o.episodeNumber ?? episodes.length + 1,
        episodeNumber: o.episodeNumber ?? episodes.length + 1,
        title: `에피소드 ${o.episodeNumber}화`,
        thumbnail: deterministicThumbnail(o.episodeNumber ?? episodes.length + 1, "1"),
        date: new Date().toISOString().slice(0, 10),
        views: 0,
        status: "PUBLISHED",
        scheduledPublishAt: null,
        ...o,
      });
    }
  }

  return episodes;
}

/** 데모 시리즈 2·4 등 — 카탈로그 episodeCount에 맞춘 간단 목록 */
function buildSimpleMockEpisodes(seriesId: string, count: number): Episode[] {
  const salt = seriesNumericSalt(seriesId);
  const episodes: Episode[] = [];

  for (let n = 1; n <= count; n++) {
    episodes.push({
      id: `${seriesId}-${n}`,
      episodeNumber: n,
      title: `에피소드 ${n}화`,
      thumbnail: deterministicThumbnail(n, seriesId),
      date: buildEpisodeDate(n, seriesId),
      views: deterministicViews(n, salt),
      status: "PUBLISHED",
    });
  }

  return episodes;
}

/** 데모 시리즈만 시드 에피소드 — 신규·기타 시리즈는 빈 상태 */
export function getSeedEpisodesForSeries(seriesId: string): Episode[] {
  if (!DEMO_SERIES_IDS.includes(seriesId as (typeof DEMO_SERIES_IDS)[number])) {
    return [];
  }

  if (seriesId === "1") {
    return buildFullMockEpisodes();
  }

  const demo = createMockSeriesRecords().find((record) => record.id === seriesId);
  if (!demo || demo.episodeCount <= 0) {
    return [];
  }

  return buildSimpleMockEpisodes(seriesId, demo.episodeCount);
}
