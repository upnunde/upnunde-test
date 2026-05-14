/**
 * 캐릭터 분석 하위 가로 탭에 노출되는 캐릭터 목록 (더미).
 *
 * 시리즈와 같이 "전체" 없이 캐릭터 단위로 분석한다.
 */
export const ANALYTICS_CHARACTER_OPTIONS = [
  { id: "kang-baekho", label: "강백호" },
  { id: "seo-yoonha", label: "서윤하" },
  { id: "lee-dohyun", label: "이도현" },
  { id: "han-sohee", label: "한소희" },
  { id: "joo-arin", label: "주아린" },
] as const;

export type AnalyticsCharacterId = (typeof ANALYTICS_CHARACTER_OPTIONS)[number]["id"];

export const DEFAULT_ANALYTICS_CHARACTER_ID: AnalyticsCharacterId = "kang-baekho";

export function getAnalyticsCharacterLabel(id: AnalyticsCharacterId): string {
  return ANALYTICS_CHARACTER_OPTIONS.find((o) => o.id === id)?.label ?? "";
}
