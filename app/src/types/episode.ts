/** 에피소드 공개 상태 */
export type EpisodeStatus = "DRAFT" | "PRIVATE" | "PUBLISHED";

/** 에피소드 목록 아이템 */
export interface Episode {
  id: string | number;
  episodeNumber: number;
  title: string;
  thumbnail: string;
  date: string;
  views: number;
  status: EpisodeStatus;
}

/** 정렬 기준 */
export type SortField = "episodeNumber" | "views";

/** 정렬 방향 */
export type SortDirection = "asc" | "desc";

/** 정렬 옵션 (정책 4: 기본값 회차 최신순 = episodeNumber desc) */
export interface SortOptions {
  field: SortField;
  direction: SortDirection;
}

/** 스낵바 상태 (정책 17) */
export interface SnackbarState {
  open: boolean;
  message: string;
}

/** 시리즈 타입: 단품이면 빈 화면 배너 미노출 (정책 15) */
export type SeriesType = "single" | "series";
