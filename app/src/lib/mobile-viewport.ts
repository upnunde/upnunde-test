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

/**
 * DS M3 Background — `--canvas` (최하위 앱 배경 면)
 * 내 작품·분석·정산·알림 등 카드 대비가 필요한 목록/대시보드 페이지
 */
export const APP_BROWSER_BG_ROOT_CLASS = "bg-canvas";

/**
 * DS M3 Background Container — `--canvas-muted`
 * 앱 기본 브라우저·페이지 셸 배경
 */
export const APP_BROWSER_BG_CLASS = "bg-canvas-muted";

/** 브라우저 chrome theme-color — canvas-muted (라이트 grayscale-15 · 다크 grayscale-130) */
export const APP_BROWSER_BG_CANVAS_THEME_COLOR_LIGHT = "#F1F4F6";
export const APP_BROWSER_BG_CANVAS_THEME_COLOR_DARK = "#323235";

/** @deprecated `APP_BROWSER_BG_CANVAS_THEME_COLOR_LIGHT` 사용 */
export const APP_BROWSER_BG_BACKGROUND_20_THEME_COLOR = APP_BROWSER_BG_CANVAS_THEME_COLOR_LIGHT;

/** 글로벌 헤더 — 모바일 sticky (문서 스크롤·당겨서 새로고침 시 함께 이동) */
export const APP_HEADER_STICKY_CLASS =
  "max-lg:sticky max-lg:top-0 max-lg:z-sticky max-lg:bg-background";

/**
 * 글로벌 헤더 외곽 가로 인셋 — `pl-0` · 우측 `pr-5`(20) · 모바일 우측 `pr-3`(12)
 * 좌측 실제 여백은 `APP_HEADER_START_INSET_CLASS`가 담당.
 */
export const APP_HEADER_EDGE_X_CLASS = "pl-0 pr-5 max-lg:pr-3";

/** 헤더 좌측 클러스터(메뉴·로고·뒤로가기) 시작 인셋 — 모바일 12 · lg+ 16 */
export const APP_HEADER_START_INSET_CLASS = "pl-3 lg:pl-4";

/**
 * 페이지 서브헤더·필터/탭 띠·에디터 상단 바 좌우 인셋
 * - 모바일: 좌우 20 (`px-5`)
 * - lg+: 좌 16 · 우 20 (`pl-4 pr-5`)
 */
export const APP_HEADER_BAR_PAD_X_CLASS = "max-lg:px-5 lg:pl-4 lg:pr-5";

/** @deprecated `APP_HEADER_STICKY_CLASS` 사용 */
export const APP_HEADER_FIXED_CLASS = APP_HEADER_STICKY_CLASS;

/** layout 셸 직하위 페이지·AppShell 래퍼 — 모바일: min-h-dvh(최소 높이) + 콘텐츠만큼 확장 */
export const APP_PAGE_ROOT_CLASS =
  "flex min-w-0 flex-col max-lg:min-h-dvh lg:min-h-0 lg:flex-1";
