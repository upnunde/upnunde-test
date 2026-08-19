import { DUMMY_BACKGROUND_GALLERY_THUMBNAILS } from "@/lib/dummy-thumbnail-images";
import { dummyAsset } from "@/lib/dummy-asset-path";
import type { SeriesFormRecord } from "@/types/series";

function deterministicSeriesThumbnail(seriesId: string): string {
  let hash = 0;
  for (const ch of seriesId) {
    hash = (hash * 31 + ch.charCodeAt(0)) >>> 0;
  }
  const index = hash % DUMMY_BACKGROUND_GALLERY_THUMBNAILS.length;
  return DUMMY_BACKGROUND_GALLERY_THUMBNAILS[index]!;
}

/** 데모 시리즈 고정 ID — 사용자 생성 작품과 병합 시 누락분만 보충 */
export const DEMO_SERIES_IDS = ["1", "2", "4"] as const;

/** 초기 데모용 시리즈 — 항상 목록에 유지(없을 때만 보충) */
export function createMockSeriesRecords(): SeriesFormRecord[] {
  return [
    {
      id: "1",
      title: "꽃에게는 독이 필요하다",
      summary: "비밀을 품은 황녀와 독이 되는 꽃의 이야기",
      keywords: ["로판", "판타지", "궁중"],
      worldviewDescription: "마법과 왕권이 공존하는 제국.",
      worldviewPrompt: "고전 로판 톤, 정치적 긴장감 유지.",
      persona: "차분하고 날카로운 1인칭 서술",
      coverImageUrl: deterministicSeriesThumbnail("1"),
      logoImageUrl: dummyAsset("renovel-logo.png"),
      status: "PUBLIC",
      createdAt: "2025-12-01T09:00:00.000Z",
      episodeCount: 120,
      viewCount: 125000,
      commentCount: 4211,
    },
    {
      id: "2",
      title: "달빛 아래 그대",
      summary: "우연한 재회로 다시 시작되는 로맨스",
      keywords: ["현대", "로맨스"],
      worldviewDescription: "현대 서울을 배경으로 한 달빛 로맨스.",
      worldviewPrompt: "감성적이고 따뜻한 대화체.",
      persona: "부드러운 3인칭 관찰자 시점",
      coverImageUrl: deterministicSeriesThumbnail("2"),
      logoImageUrl: dummyAsset("renovel-logo.png"),
      status: "PRIVATE",
      createdAt: "2025-11-15T14:30:00.000Z",
      episodeCount: 50,
      viewCount: 8900,
      commentCount: 128,
    },
    {
      id: "4",
      title: "가이드 위반 작품",
      summary: "정책 위반 상태 데모",
      keywords: ["데모"],
      worldviewDescription: "이용금지 상태 시연용.",
      worldviewPrompt: "데모",
      persona: "데모",
      coverImageUrl: deterministicSeriesThumbnail("4"),
      logoImageUrl: dummyAsset("renovel-logo.png"),
      status: "BANNED",
      createdAt: "2025-10-01T00:00:00.000Z",
      episodeCount: 10,
      viewCount: 3200,
      commentCount: 42,
    },
  ];
}
