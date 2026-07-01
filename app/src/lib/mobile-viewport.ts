/** 모바일 브레이크포인트 — Tailwind `max-lg`와 동일 */
export const MOBILE_MEDIA_QUERY = "(max-width: 1023px)";

/**
 * 모바일 fixed 하단 앵커 — 브라우저 하단 바 높이만큼 함께 올라감·내려감.
 * `bottom-0` 대신 사용한다.
 */
export const MOBILE_FIXED_BOTTOM_ANCHOR_CLASS =
  "max-lg:bottom-[var(--app-vv-bottom,0px)]";

/**
 * 모바일 fixed 하단 앵커 — 키보드 열림 시 `--app-keyboard-inset`, 닫힘 시 `--app-vv-bottom`.
 * 에디터 블록 툴바 등 키보드 위에 붙어야 하는 UI에 사용한다.
 */
export const MOBILE_FIXED_BOTTOM_DYNAMIC_ANCHOR_CLASS =
  "max-lg:bottom-[var(--app-keyboard-inset,var(--app-vv-bottom,0px))]";

/** 모바일 하단 고정 UI 내부 safe-area 패딩(홈 인디케이터) */
export const MOBILE_FIXED_BOTTOM_SAFE_PAD_CLASS =
  "max-lg:pb-[env(safe-area-inset-bottom,0px)]";

/** 모바일 바텀 시트·고정 바 — 크롬 앵커 + safe-area */
export const MOBILE_BOTTOM_SHEET_PAD_CLASS = [
  MOBILE_FIXED_BOTTOM_ANCHOR_CLASS,
  MOBILE_FIXED_BOTTOM_SAFE_PAD_CLASS,
].join(" ");

/** 모바일 full-width 하단 고정 바 셸(탭 네비·액션 바 등) */
export const MOBILE_FIXED_BOTTOM_BAR_SHELL_CLASS = [
  "max-lg:fixed max-lg:inset-x-0 max-lg:z-overlay",
  MOBILE_FIXED_BOTTOM_ANCHOR_CLASS,
].join(" ");

/** 모바일 fixed 요소 bottom offset — spacing-4 + safe-area + 브라우저 하단 크롬 */
export const MOBILE_FIXED_BOTTOM_OFFSET_CLASS =
  "max-lg:bottom-[calc(var(--space-4)+env(safe-area-inset-bottom,0px)+var(--app-keyboard-inset,var(--app-vv-bottom,0px)))]";

/**
 * 앱 루트 셸
 * - 모바일: min-h-dvh 문서 스크롤(내부 overflow 트랩 없음)
 * - 데스크톱: h-dvh 고정 + 내부 스크롤
 */
export const APP_VIEWPORT_SHELL_CLASS =
  "flex w-full min-h-dvh flex-col box-border lg:h-dvh lg:max-h-dvh lg:overflow-hidden";

/** 브라우저·페이지 셸 배경 — DS canvas (라이트 white · 다크 black) */
export const APP_BROWSER_BG_CLASS = "bg-canvas";

/** 브라우저 chrome theme-color — DS canvas (라이트 white · 다크 black) */
export const APP_BROWSER_BG_CANVAS_THEME_COLOR_LIGHT = "#ffffff";
export const APP_BROWSER_BG_CANVAS_THEME_COLOR_DARK = "#000000";

/** @deprecated `APP_BROWSER_BG_CANVAS_THEME_COLOR_LIGHT` 사용 */
export const APP_BROWSER_BG_BACKGROUND_20_THEME_COLOR = APP_BROWSER_BG_CANVAS_THEME_COLOR_LIGHT;

/** 글로벌 헤더 — 모바일 sticky (문서 스크롤·당겨서 새로고침 시 함께 이동) */
export const APP_HEADER_STICKY_CLASS =
  "max-lg:sticky max-lg:top-0 max-lg:z-sticky max-lg:bg-background";

/** @deprecated `APP_HEADER_STICKY_CLASS` 사용 */
export const APP_HEADER_FIXED_CLASS = APP_HEADER_STICKY_CLASS;

/** layout 셸 직하위 페이지·AppShell 래퍼 — 모바일: min-h-dvh(최소 높이) + 콘텐츠만큼 확장 */
export const APP_PAGE_ROOT_CLASS =
  "flex min-w-0 flex-col max-lg:min-h-dvh lg:min-h-0 lg:flex-1";
