import {
  MOBILE_FIXED_BOTTOM_DYNAMIC_ANCHOR_CLASS,
  MOBILE_FIXED_BOTTOM_OFFSET_CLASS,
} from "@/lib/mobile-viewport";

export type EditorMobilePanel = "edit" | "preview";

/** 모바일 미리보기 탭 활성 여부 */
export function isEditorMobilePreviewActive(
  isDesktop: boolean,
  panel: EditorMobilePanel,
): boolean {
  return !isDesktop && panel === "preview";
}

/** 모바일 미리보기 시 앱 헤더·서브헤더 등 크롬 숨김 */
export function editorMobilePreviewChromeHiddenClass(
  isDesktop: boolean,
  panel: EditorMobilePanel,
): string | undefined {
  return isEditorMobilePreviewActive(isDesktop, panel) ? "max-lg:hidden" : undefined;
}

/**
 * 모바일 미리보기 풀화면 셸 — visualViewport 상·하단 크롬에 맞춰 고정.
 * 문서 스크롤 대신 `useMobilePreviewScrollLock`과 함께 사용한다.
 */
export const EDITOR_MOBILE_PREVIEW_SHELL_CLASS = [
  "flex min-h-0 flex-1 flex-col overflow-hidden bg-black",
  "max-lg:fixed max-lg:inset-x-0 max-lg:z-20",
  "max-lg:top-[var(--app-vv-offset-top,0px)]",
  "max-lg:bottom-[var(--app-keyboard-inset,var(--app-vv-bottom,0px))]",
].join(" ");

/** 미리보기 대사·선택지 — 하단 FAB·브라우저 바 위 inset */
export const EDITOR_MOBILE_PREVIEW_OVERLAY_BOTTOM_CLASS =
  "max-lg:bottom-[calc(var(--spacing-my-16)+3rem+env(safe-area-inset-bottom,0px)+var(--app-keyboard-inset,var(--app-vv-bottom,0px)))]";

/** 미리보기 탭 유도·종료 힌트 — FAB 위 여백 */
export const EDITOR_MOBILE_PREVIEW_HINT_BOTTOM_CLASS =
  "max-lg:bottom-[calc(var(--spacing-my-16)+3rem+var(--spacing-my-24)+env(safe-area-inset-bottom,0px)+var(--app-keyboard-inset,var(--app-vv-bottom,0px)))]";

/** 모바일 에디터 FAB 공통 크기 — 48×48 */
export const EDITOR_MOBILE_FAB_SIZE_CLASS = "h-12 w-12 shrink-0";

/** FAB 스택 가로 정렬 · 우측 inset */
export const EDITOR_MOBILE_FAB_RIGHT_CLASS = "right-my-16";

/** 전환 FAB ↔ 오류 FAB 세로 간격 */
export const EDITOR_MOBILE_FAB_STACK_GAP_CLASS = "gap-my-8";

/** 뷰포트 하단 기준 inset (블록 툴바 없음) */
export const EDITOR_MOBILE_FAB_BOTTOM_BASE_CLASS = MOBILE_FIXED_BOTTOM_OFFSET_CLASS;

/** 전환 FAB(48px) 바로 위 — 미리보기 「처음부터」 FAB */
export const EDITOR_MOBILE_FAB_BOTTOM_ABOVE_PANEL_TOGGLE_CLASS =
  "max-lg:bottom-[calc(var(--spacing-my-16)+3rem+var(--spacing-my-8)+env(safe-area-inset-bottom,0px)+var(--app-keyboard-inset,var(--app-vv-bottom,0px)))]";

/** 블록 도킹 툴바 높이(py-my-8 + h-10) — 3.5rem */
export const EDITOR_MOBILE_DOCKED_TOOLBAR_HEIGHT = "3.5rem";

/** 블록 도킹 툴바 위 전환 FAB */
export const EDITOR_MOBILE_FAB_BOTTOM_ABOVE_BLOCK_TOOLBAR_CLASS =
  "max-lg:bottom-[calc(var(--spacing-my-16)+3.5rem+env(safe-area-inset-bottom,0px)+var(--app-keyboard-inset,var(--app-vv-bottom,0px)))]";

export const EDITOR_MOBILE_DOCKED_TOOLBAR_SHELL_CLASS = [
  "fixed inset-x-0 z-30 border-t border-border-10 bg-white px-my-12 pt-my-8",
  "pb-[calc(var(--spacing-my-8)+env(safe-area-inset-bottom,0px))]",
  MOBILE_FIXED_BOTTOM_DYNAMIC_ANCHOR_CLASS,
  "lg:hidden",
].join(" ");

/** 키보드 열림 시 블록 툴바 — 키보드 바로 위, safe-area 패딩 생략 */
export const EDITOR_MOBILE_KEYBOARD_TOOLBAR_SHELL_CLASS = [
  "fixed inset-x-0 z-40 border-t border-border-10 bg-white px-my-12 py-my-8",
  MOBILE_FIXED_BOTTOM_DYNAMIC_ANCHOR_CLASS,
  "lg:hidden",
].join(" ");

/** 모바일 편집 스크롤 하단 여백 — FAB만 (툴바 숨김) */
export const EDITOR_MOBILE_SCROLL_BOTTOM_PAD_FAB_ONLY_CLASS =
  "max-lg:pb-[calc(3rem+var(--spacing-my-16)+var(--spacing-my-8)+env(safe-area-inset-bottom,0px)+var(--app-vv-bottom,0px))]";

/** 모바일 편집 스크롤 하단 여백 — 도킹 툴바 + FAB */
export const EDITOR_MOBILE_SCROLL_BOTTOM_PAD_WITH_TOOLBAR_CLASS =
  "max-lg:pb-[calc(3.5rem+3rem+var(--spacing-my-16)+var(--spacing-my-8)+env(safe-area-inset-bottom,0px)+var(--app-vv-bottom,0px))]";

/** @deprecated `EDITOR_MOBILE_SCROLL_BOTTOM_PAD_WITH_TOOLBAR_CLASS` 사용 */
export const EDITOR_MOBILE_SCROLL_BOTTOM_PAD_CLASS =
  EDITOR_MOBILE_SCROLL_BOTTOM_PAD_WITH_TOOLBAR_CLASS;

export function isEditorMobileBlockToolbarVisible(options: {
  focusBlockId: string | null;
  isKeyboardOpen: boolean;
  mobileKeyboardEditBlockId: string | null;
}): boolean {
  const { focusBlockId, isKeyboardOpen, mobileKeyboardEditBlockId } = options;
  if (isKeyboardOpen) {
    return mobileKeyboardEditBlockId != null;
  }
  return focusBlockId != null;
}

export const EDITOR_MOBILE_FAB_BUTTON_CLASS =
  "flex cursor-pointer items-center justify-center rounded-full border border-border-10 bg-white text-on-surface-20 shadow-elevation-20 transition-colors active:bg-surface-20 lg:hover:bg-surface-20";
