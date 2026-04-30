/** 분석 상단 범위 칩: 전체·시리즈·캐릭터·상황공략 */
export type AnalyticsScopeCategoryId = "all" | "series" | "character" | "scenario";

export const ANALYTICS_SCOPE_CHIPS: { id: AnalyticsScopeCategoryId; label: string }[] = [
  { id: "all", label: "전체" },
  { id: "series", label: "시리즈" },
  { id: "character", label: "캐릭터" },
  { id: "scenario", label: "상황공략" },
];
