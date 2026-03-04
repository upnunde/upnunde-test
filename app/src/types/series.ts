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
}
