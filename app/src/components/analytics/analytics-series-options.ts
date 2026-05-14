/**
 * 시리즈 분석 하위 가로 탭에 노출되는 작품 목록 (더미).
 */
export const ANALYTICS_SERIES_WORK_OPTIONS = [
  { id: "guy-date", label: "그놈과의 데이트" },
  { id: "her-heart", label: "그녀의 마음을 사로잡아라" },
  { id: "rich-youngest", label: "부자집 막내아들과의 스캔들" },
  { id: "romance-hysterie", label: "로망스 히스테리" },
] as const;

export type AnalyticsSeriesWorkId = (typeof ANALYTICS_SERIES_WORK_OPTIONS)[number]["id"];

export const ALL_ANALYTICS_SERIES_ID = "all" as const;

/** 시리즈 필터 드롭다운 — 시리즈 전체 + 개별 작품 */
export const ANALYTICS_SERIES_OPTIONS = [
  { id: ALL_ANALYTICS_SERIES_ID, label: "시리즈 전체" },
  ...ANALYTICS_SERIES_WORK_OPTIONS,
] as const;

export type AnalyticsSeriesId = (typeof ANALYTICS_SERIES_OPTIONS)[number]["id"];

export const DEFAULT_ANALYTICS_SERIES_ID: AnalyticsSeriesId = "guy-date";

export function isAllAnalyticsSeriesId(id: AnalyticsSeriesId): id is typeof ALL_ANALYTICS_SERIES_ID {
  return id === ALL_ANALYTICS_SERIES_ID;
}

export function getAnalyticsSeriesLabel(id: AnalyticsSeriesId): string {
  return ANALYTICS_SERIES_OPTIONS.find((o) => o.id === id)?.label ?? "";
}
