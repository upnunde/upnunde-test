/** 내 작품 영역: 시리즈 / 캐릭터 / 상황공략 탭과 경로 */

/**
 * 시리즈 목록 그리드가 2열일 때 카드·생성 슬롯 한 칸과 동일한 최대 너비.
 * 부모 `max-w-[1200px]`, `gap-4` 기준 → (1200 − 16) / 2 = 592px
 */
export const WORKS_GRID_CELL_MAX_WIDTH_CLASS =
  "min-w-0 w-full max-w-[592px] justify-self-start" as const;

/** 내 작품 목록 카드(시리즈·캐릭터·상황공략) 공통 셸 — max-lg: 모바일 카드 · lg+: 가로형 카드 */
export const WORKS_ITEM_CARD_CLASS =
  "flex h-full min-w-0 w-full flex-col gap-my-12 lg:flex-row lg:gap-my-20 max-lg:rounded-[8px] max-lg:border-0 max-lg:shadow-elevation-30 lg:rounded-[4px] lg:border lg:border-border-10 lg:shadow-none bg-white py-my-20 px-my-20";

/** max-lg: 썸네일+정보 가로 한 줄 · lg+: contents로 썸네일·우측열 분리 */
export const WORKS_ITEM_CARD_INNER_CLASS =
  "flex min-w-0 w-full flex-row gap-my-12 lg:contents lg:gap-my-20";

export const WORKS_ITEM_THUMBNAIL_CLASS =
  "relative aspect-[9/16] w-[calc(7rem*0.8)] lg:w-28 shrink-0 overflow-hidden rounded bg-slate-200";

/** 내 작품 카드 — 상태 뱃지·제목: 모바일 세로 · lg+ 가로 */
export const WORKS_ITEM_TITLE_GROUP_CLASS =
  "flex min-w-0 flex-1 flex-col items-start gap-my-8 lg:flex-row lg:items-center";

/** 내 작품 카드 메타(날짜·조회수 등) — max-lg: 상단 20px · lg+: mt-0 */
export const WORKS_ITEM_META_ROW_CLASS =
  "mt-my-20 flex w-full text-body4_400 text-on-surface-20 lg:mb-5 lg:mt-0 [&_svg]:shrink-0 [&_svg]:text-on-surface-20";

/** 내 작품 목록 그리드 — 모바일 1열 · md+(태블릿)~데스크톱 2열(max 1200px) */
export const WORKS_LIST_GRID_CLASS =
  "mx-auto grid w-full min-w-0 max-w-[1200px] grid-cols-1 items-stretch gap-my-12 md:grid-cols-2 md:gap-my-16";

/** 목록 그리드 내 생성 CTA 슬롯 — 같은 행의 카드 높이에 맞춤 */
export const WORKS_LIST_CREATE_SLOT_CLASS = "flex h-full min-w-0 flex-col";

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

/** 내 작품 — 캐릭터 설정(편집) */
export function getWorksCharacterEditPath(characterId: string): string {
  return `/series/character/${encodeURIComponent(characterId)}`;
}

export function getWorksTabFromPathname(pathname: string | null): WorksTabId {
  if (!pathname) return "series";
  const normalized = pathname.replace(/\/$/, "") || "/";
  if (normalized === "/series/character") return "character";
  if (normalized === "/series/scenario") return "scenario";
  return "series";
}
