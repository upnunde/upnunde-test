import type { SeriesStatus } from "@/types/series";

/** 시리즈 리소스에서 불러온 캐릭터의 귀속 시리즈 */
export interface CharacterSourceSeries {
  id: string;
  title: string;
}

/** 내 작품 — 캐릭터 목록 한 줄 (시리즈 카드와 동일 정책·포맷 재사용) */
export interface CharacterData {
  id: string;
  title: string;
  /** 한 줄 소개 */
  tagline: string;
  thumbnailUrl?: string;
  status: SeriesStatus;
  createdAt: string;
  viewCount: number;
  /** 보조 지표 1 (좋아요 등) */
  stat1: number;
  /** 보조 지표 2 (댓글 등) */
  stat2: number;
  /** 시리즈 리소스에서 불러온 경우에만 표시 */
  sourceSeries?: CharacterSourceSeries;
}
