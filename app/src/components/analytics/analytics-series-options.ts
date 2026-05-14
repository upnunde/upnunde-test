/**
 * 시리즈 분석 하위 가로 탭에 노출되는 작품 목록 (더미).
 *
 * "전체 시리즈" 옵션이 없는 이유: 시리즈는 각자 독립된 작품이라 4편의 완독률을 합산하면
 * 운영 단서가 흐려진다. 운영자는 항상 "이 작품"을 한 단위로 분석한다.
 */
export const ANALYTICS_SERIES_OPTIONS = [
  { id: "guy-date", label: "그놈과의 데이트" },
  { id: "her-heart", label: "그녀의 마음을 사로잡아라" },
  { id: "rich-youngest", label: "부자집 막내아들과의 스캔들" },
  { id: "romance-hysterie", label: "로망스 히스테리" },
] as const;

export type AnalyticsSeriesId = (typeof ANALYTICS_SERIES_OPTIONS)[number]["id"];

export const DEFAULT_ANALYTICS_SERIES_ID: AnalyticsSeriesId = "guy-date";

export function getAnalyticsSeriesLabel(id: AnalyticsSeriesId): string {
  return ANALYTICS_SERIES_OPTIONS.find((o) => o.id === id)?.label ?? "";
}
