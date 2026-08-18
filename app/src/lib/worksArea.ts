/** 내 작품 영역: 시리즈 / 캐릭터 / 상황공략 탭과 경로 */

/**
 * 시리즈 목록 그리드가 2열일 때 카드·생성 슬롯 한 칸과 동일한 최대 너비.
 * 부모 `max-w-[1200px]`, `gap-4` 기준 → (1200 − 16) / 2 = 592px
 */
export const WORKS_GRID_CELL_MAX_WIDTH_CLASS =
  "min-w-0 w-full max-w-[592px] justify-self-start" as const;

/** 내 작품 목록 카드(시리즈·캐릭터·상황공략) 공통 셸 — max-lg: 모바일 카드 · lg+: 가로형 카드 */
export const WORKS_ITEM_CARD_CLASS =
  "flex h-full min-w-0 w-full flex-col gap-3 lg:flex-row lg:gap-5 max-lg:rounded-md max-lg:border max-lg:border-border max-lg:shadow-none lg:rounded-sm lg:border lg:border-border lg:shadow-none bg-background py-5 px-5";

/** max-lg: 썸네일+정보 가로 한 줄 · lg+: contents로 썸네일·우측열 분리 */
export const WORKS_ITEM_CARD_INNER_CLASS =
  "flex min-w-0 w-full flex-row gap-3 lg:contents lg:gap-5";

export const WORKS_ITEM_THUMBNAIL_CLASS =
  "relative aspect-[9/16] w-[calc(7rem*0.8)] lg:w-28 shrink-0 overflow-hidden rounded bg-background-muted";

/** 내 작품 카드 — 상태 뱃지·제목: 모바일 세로 · lg+ 가로 */
export const WORKS_ITEM_TITLE_GROUP_CLASS =
  "flex min-w-0 flex-1 flex-col items-start gap-2 lg:flex-row lg:items-center";

/** 내 작품 카드 메타(날짜·조회수 등) — max-lg: 상단 20px · lg+: mt-0 */
export const WORKS_ITEM_META_ROW_CLASS =
  "mt-5 flex w-full text-body4_400 text-foreground-muted lg:mb-5 lg:mt-0 [&_svg]:shrink-0 [&_svg]:text-foreground-muted";

/** 내 작품 목록 그리드 — 모바일 1열 · lg+ 2열(max 1200px) */
export const WORKS_LIST_GRID_CLASS =
  "mx-auto grid w-full min-w-0 max-w-[1200px] grid-cols-1 items-stretch gap-3 lg:grid-cols-2 lg:gap-4";

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
