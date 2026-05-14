/**
 * 분석 상단 범위 칩: 시리즈·캐릭터·상황공략.
 *
 * "전체"가 없는 이유: 시리즈(선형 스토리텔링)·캐릭터(관계 지향)·상황공략(샌드박스)는
 * 서로 추구하는 본질이 달라(완독률 vs 친밀도 vs 클리어율) 같은 지표로 합산할 수 없다.
 * 통합 요약이 필요해지면 별도 "개요" 화면으로 분리하는 게 자연스럽다.
 */
export type AnalyticsScopeCategoryId = "series" | "character" | "scenario";

export const ANALYTICS_SCOPE_CHIPS: { id: AnalyticsScopeCategoryId; label: string }[] = [
  { id: "series", label: "시리즈" },
  { id: "character", label: "캐릭터" },
  { id: "scenario", label: "상황공략" },
];

export const ANALYTICS_DEFAULT_SCOPE_CATEGORY: AnalyticsScopeCategoryId = "series";
