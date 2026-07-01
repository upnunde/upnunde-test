/**
 * 에디터 도메인 커스텀 컨트롤 — 형태·기능은 도메인, 파운데이션은 DS만.
 * 블록 속성 트리거 칩 → `BlockAttributeTrigger` (DS Button 래핑)
 */

/** 텍스트 선택 플로팅 툴바 셸 */
export const EDITOR_TEXT_FORMAT_TOOLBAR_SHELL_CLASS =
  "fixed z-modal flex items-center overflow-visible rounded-md border border-border-strong bg-inverse";

/** 툴바 아이콘·트리거 버튼 */
export const EDITOR_TEXT_FORMAT_TOOLBAR_BUTTON_CLASS =
  "rounded-sm p-2 text-inverse-foreground transition-colors duration-short ease-standard hover:bg-inverse-foreground/20";

/** 툴바 구분선 */
export const EDITOR_TEXT_FORMAT_TOOLBAR_DIVIDER_CLASS =
  "mx-1 h-5 w-px bg-border-strong";

/** 툴바 드롭다운 트리거 */
export const EDITOR_TEXT_FORMAT_TOOLBAR_MENU_TRIGGER_CLASS =
  "flex items-center gap-1 rounded-sm px-3 py-2 text-body3_400 text-inverse-foreground outline-none transition-colors duration-short ease-standard hover:bg-inverse-foreground/20";

/** 툴바 드롭다운 패널 */
export const EDITOR_TEXT_FORMAT_TOOLBAR_MENU_CONTENT_CLASS =
  "z-dropdown w-40 rounded-lg border border-border bg-background p-1";
