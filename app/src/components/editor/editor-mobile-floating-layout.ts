import { MOBILE_FIXED_BOTTOM_OFFSET_CLASS } from "@/lib/mobile-viewport";

export type EditorMobilePanel = "edit" | "preview";

/** 모바일 에디터 FAB 공통 크기 — 48×48 */
export const EDITOR_MOBILE_FAB_SIZE_CLASS = "h-12 w-12 shrink-0";

/** FAB 스택 가로 정렬 · 우측 inset */
export const EDITOR_MOBILE_FAB_RIGHT_CLASS = "right-my-16";

/** 전환 FAB ↔ 오류 FAB 세로 간격 */
export const EDITOR_MOBILE_FAB_STACK_GAP_CLASS = "gap-my-8";

/** 뷰포트 하단 기준 inset (블록 툴바 없음) */
export const EDITOR_MOBILE_FAB_BOTTOM_BASE_CLASS = MOBILE_FIXED_BOTTOM_OFFSET_CLASS;

/**
 * 블록 도킹 툴바(py-my-8 + h-10) 위 + my-16 여백.
 * `EditorMobileBlockToolbar` max-h-16 도킹과 맞춘다.
 */
export const EDITOR_MOBILE_FAB_BOTTOM_ABOVE_BLOCK_TOOLBAR_CLASS =
  "max-lg:bottom-[calc(var(--spacing-my-16)+3.5rem+env(safe-area-inset-bottom,0px)+var(--app-vv-bottom,0px))]";

export const EDITOR_MOBILE_FAB_BUTTON_CLASS =
  "flex cursor-pointer items-center justify-center rounded-full border border-border-10 bg-white text-on-surface-20 shadow-elevation-20 transition-colors active:bg-surface-20 lg:hover:bg-surface-20";
