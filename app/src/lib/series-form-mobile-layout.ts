/** 모바일 고정 제출 바(임시저장·등록하기) — py-12 + 버튼 36 + pb-12 + safe-area */
export const SERIES_FORM_SUBMIT_BAR_MOBILE_STACK_HEIGHT =
  "calc(var(--space-3)+var(--space-9)+var(--space-3)+env(safe-area-inset-bottom,0px))";

/** AI 컴포저·미리보기 FAB — 제출 바 위 플로팅 행 */
export const SERIES_FORM_MOBILE_FLOATING_ROW_BOTTOM_CLASS =
  "max-lg:bottom-[calc(var(--space-3)+var(--space-9)+var(--space-3)+env(safe-area-inset-bottom,0px)+var(--space-5)+var(--app-keyboard-inset,var(--app-vv-bottom,0px)))]";

/** AI 컴포저 — 우측 FAB(48px)·간격·inset 확보 */
export const SERIES_FORM_MOBILE_COMPOSER_FIXED_INSET_CLASS =
  "left-[max(var(--space-5),env(safe-area-inset-left,0px))] right-[calc(var(--space-4)+3rem+var(--space-2)+env(safe-area-inset-right,0px))] w-auto max-w-[560px] translate-x-0";

/** 모바일 고정 제출 바만큼 스크롤 여백 */
export const SERIES_FORM_MOBILE_SCROLL_PAD_CLASS =
  "max-lg:pb-[calc(var(--space-3)+var(--space-9)+var(--space-3)+env(safe-area-inset-bottom,0px))]";

/** 모바일 고정 제출 바 + 플로팅 AI 컴포저 */
export const SERIES_FORM_MOBILE_SCROLL_PAD_WITH_COMPOSER_CLASS =
  "max-lg:pb-[calc(var(--space-5)+3rem+var(--space-3)+var(--space-9)+var(--space-3)+env(safe-area-inset-bottom,0px)+var(--app-keyboard-inset,var(--app-vv-bottom,0px)))]";
