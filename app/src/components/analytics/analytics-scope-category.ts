/**
 * 분석 상단 범위 칩: 전체·시리즈·캐릭터·상황공략.
 * 전체는 엔티티 드롭다운 없이 스튜디오 합산. 시리즈·캐릭터·상황공략은 해당 단위만 본다.
 */
export type AnalyticsScopeCategoryId = "all" | "series" | "character" | "scenario";

export const ANALYTICS_SCOPE_CHIPS: { id: AnalyticsScopeCategoryId; label: string }[] = [
  { id: "all", label: "전체" },
  { id: "series", label: "시리즈" },
  { id: "character", label: "캐릭터" },
  { id: "scenario", label: "상황공략" },
];

export const ANALYTICS_DEFAULT_SCOPE_CATEGORY: AnalyticsScopeCategoryId = "series";

export function isAnalyticsEntityScope(
  id: AnalyticsScopeCategoryId,
): id is Exclude<AnalyticsScopeCategoryId, "all"> {
  return id !== "all";
}
