/** 내 작품 영역: 시리즈 / 캐릭터 / 상황공략 탭과 경로 */

/**
 * 시리즈 목록 그리드가 2열일 때 카드·생성 슬롯 한 칸과 동일한 최대 너비.
 * 부모 `max-w-[1200px]`, `gap-4` 기준 → (1200 − 16) / 2 = 592px
 */
export const WORKS_GRID_CELL_MAX_WIDTH_CLASS =
  "min-w-0 w-full max-w-[592px] justify-self-start" as const;

export const WORKS_TABS = [
  { id: "series", label: "시리즈" },
  { id: "character", label: "캐릭터" },
  { id: "scenario", label: "상황공략" },
] as const;

export type WorksTabId = (typeof WORKS_TABS)[number]["id"];

export const WORKS_TAB_PATH: Record<WorksTabId, string> = {
  series: "/series",
  character: "/series/character",
  scenario: "/series/scenario",
};

export function getWorksTabFromPathname(pathname: string | null): WorksTabId {
  if (!pathname) return "series";
  const normalized = pathname.replace(/\/$/, "") || "/";
  if (normalized === "/series/character") return "character";
  if (normalized === "/series/scenario") return "scenario";
  return "series";
}
