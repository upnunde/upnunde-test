/**
 * 시리즈 공개 상태
 * - PUBLIC: 기본(공개)
 * - PRIVATE: 비공개
 * - DRAFT: 작성중(임시저장)
 * - BANNED: 이용금지
 */
export type SeriesStatus = "PUBLIC" | "PRIVATE" | "DRAFT" | "BANNED";

/**
 * 시리즈 목록 아이템 (정책 2, 6, 8, 9, 10, 11, 13)
 */
export interface SeriesData {
  id: string;
  title: string;
  /** DRAFT 상태일 경우 없을 수 있음 */
  thumbnailUrl?: string;
  status: SeriesStatus;
  /** ISO String 또는 타임스탬프 */
  createdAt: string;
  episodeCount: number;
  viewCount: number;
  /** 누적 댓글 수 */
  commentCount: number;
}

/** 시리즈 폼 전체 스냅샷 (목록 + 상세 편집) */
export interface SeriesFormRecord {
  id: string;
  title: string;
  summary: string;
  keywords: string[];
  worldviewDescription: string;
  worldviewPrompt: string;
  persona: string;
  coverImageUrl: string;
  logoImageUrl: string;
  status: SeriesStatus;
  createdAt: string;
  episodeCount: number;
  viewCount: number;
  commentCount: number;
}

export function seriesFormRecordToListItem(record: SeriesFormRecord): SeriesData {
  return {
    id: record.id,
    title: record.title,
    thumbnailUrl: record.coverImageUrl || undefined,
    status: record.status,
    createdAt: record.createdAt,
    episodeCount: record.episodeCount,
    viewCount: record.viewCount,
    commentCount: record.commentCount,
  };
}
