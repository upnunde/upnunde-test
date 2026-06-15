/** 내 작품 영역: 시리즈 / 캐릭터 / 상황공략 탭과 경로 */

/**
 * 시리즈 목록 그리드가 2열일 때 카드·생성 슬롯 한 칸과 동일한 최대 너비.
 * 부모 `max-w-[1200px]`, `gap-4` 기준 → (1200 − 16) / 2 = 592px
 */
export const WORKS_GRID_CELL_MAX_WIDTH_CLASS =
  "min-w-0 w-full max-w-[592px] justify-self-start" as const;

/** 내 작품 목록 카드(시리즈·캐릭터·상황공략) 공통 셸 */
export const WORKS_ITEM_CARD_CLASS =
  "flex min-w-0 w-full flex-col gap-my-12 lg:gap-my-20 rounded-[4px] border border-border-10 bg-white py-my-20 px-my-20 min-[480px]:flex-row";

/** 모바일 가로(썸네일+정보) · 데스크톱 contents */
export const WORKS_ITEM_CARD_INNER_CLASS =
  "flex min-w-0 w-full flex-row gap-my-12 lg:gap-my-20 min-[480px]:contents";

export const WORKS_ITEM_THUMBNAIL_CLASS =
  "relative aspect-[9/16] w-28 shrink-0 overflow-hidden rounded bg-slate-200";

/** 내 작품 카드 메타(날짜·조회수 등) — 모바일 상단 20px · 480px+ mt-0 */
export const WORKS_ITEM_META_ROW_CLASS =
  "mt-my-20 flex w-full text-body4_400 text-on-surface-20 min-[480px]:mb-5 min-[480px]:mt-0 [&_svg]:shrink-0 [&_svg]:text-on-surface-20";

/** 내 작품 목록 그리드 */
export const WORKS_LIST_GRID_CLASS =
  "grid w-full grid-cols-[repeat(auto-fit,minmax(min(100%,480px),1fr))] gap-my-12 lg:gap-my-16";

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

/** 내 작품 — 새 캐릭터 생성 (`CharacterDetailPage`와 동일 폼) */
export const WORKS_CHARACTER_NEW_PATH = "/series/character/new";

export function getWorksTabFromPathname(pathname: string | null): WorksTabId {
  if (!pathname) return "series";
  const normalized = pathname.replace(/\/$/, "") || "/";
  if (normalized === "/series/character") return "character";
  if (normalized === "/series/scenario") return "scenario";
  return "series";
}
