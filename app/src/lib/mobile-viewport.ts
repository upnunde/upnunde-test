/** 모바일 바텀 시트·고정 UI 하단 패딩 — safe-area + 브라우저 하단 크롬 */
export const MOBILE_BOTTOM_SHEET_PAD_CLASS =
  "pb-[calc(env(safe-area-inset-bottom,0px)+var(--app-vv-bottom,0px))]";

/** 모바일 fixed 요소 bottom offset — spacing-my-16 + safe-area + 브라우저 하단 크롬 */
export const MOBILE_FIXED_BOTTOM_OFFSET_CLASS =
  "max-lg:bottom-[calc(var(--spacing-my-16)+env(safe-area-inset-bottom,0px)+var(--app-vv-bottom,0px))]";

/** full-height 앱 루트 — 모바일 safe-area·브라우저 크롬 inset */
export const APP_VIEWPORT_SHELL_CLASS =
  "flex h-dvh w-full flex-col overflow-hidden box-border max-lg:pt-[calc(env(safe-area-inset-top,0px)+var(--app-vv-top,0px))] max-lg:pb-[calc(env(safe-area-inset-bottom,0px)+var(--app-vv-bottom,0px))]";

/** 로그인 등 단일 열 — 세로 inset만 */
export const MOBILE_VIEWPORT_INSET_Y_CLASS =
  "max-lg:pt-[calc(env(safe-area-inset-top,0px)+var(--app-vv-top,0px))] max-lg:pb-[calc(env(safe-area-inset-bottom,0px)+var(--app-vv-bottom,0px))]";
