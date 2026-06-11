import { cn } from "@/lib/utils";

/** 가이드 modal 셸 — 480px, Header/Footer 분리 프레임 */
export const modalDialogContentClassName =
  "flex w-[480px] max-w-[calc(100vw-2rem)] flex-col items-stretch gap-0 overflow-hidden border-0 bg-surface-10 p-0 shadow-elevation-50 rounded-[4px]";

/**
 * M3 모달 바텀 시트 최대 높이 — `100dvh` 기준 92% detent(상단 스크림 ~8% peek), 대형 뷰 상한 900px.
 * `dialog.tsx` `presentation="auto"`, `formDialogShellClassName`과 동일.
 */
export const mobileBottomSheetMaxHeightClassName = "max-h-[min(92dvh,900px)]";

export {
  MOBILE_BOTTOM_SHEET_PAD_CLASS,
  MOBILE_FIXED_BOTTOM_ANCHOR_CLASS,
  MOBILE_FIXED_BOTTOM_BAR_SHELL_CLASS,
  MOBILE_FIXED_BOTTOM_SAFE_PAD_CLASS,
} from "@/lib/mobile-viewport";

/** 넓은 폼 Dialog 셸 — 모바일 full-width 바텀 시트 / 데스크톱 중앙 */
export const formDialogShellClassName =
  "flex min-w-0 flex-col overflow-hidden border-0 bg-transparent p-0 shadow-none max-lg:h-[min(92dvh,900px)] max-lg:max-w-none max-lg:w-full max-lg:bg-white max-lg:shadow-elevation-50 max-lg:pb-0 lg:h-[min(90vh,calc(100dvh-80px))] lg:w-[min(92vw,760px)] lg:max-w-[760px]";

/** 바텀 시트 안 폼 본문 — EpisodeForm 등 */
export const formDialogSheetEpisodeFormClassName =
  "mx-0 max-w-none min-w-0 flex-1 min-h-0 rounded-none border-0 bg-white shadow-none lg:mx-auto lg:max-w-[760px] lg:rounded-[16px] lg:border lg:border-border-10";

/** 바텀 시트 내부 래퍼 — 헤더·푸터 사이 flex 체인 */
export const formDialogSheetBodyWrapperClassName =
  "flex min-h-0 flex-1 flex-col overflow-hidden";

/** 바텀 시트·폼 모달 스크롤 본문 — 고정 푸터 위 스크롤 영역 */
export const formDialogSheetScrollBodyClassName =
  "min-h-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-contain pb-my-20";

/** 바텀 시트·폼 모달 하단 고정 버튼 영역 — 모바일 safe-area·브라우저 하단 크롬 포함 */
export const formDialogSheetStickyFooterClassName = cn(
  "mt-auto shrink-0 border-t border-border-10 bg-white px-my-16 lg:px-my-20 pt-my-16 pb-my-16",
  "max-lg:pb-[calc(var(--spacing-my-16)+env(safe-area-inset-bottom,0px))]",
);

export const modalHeaderClassName =
  "flex min-h-40 w-full flex-col items-center gap-my-20 self-stretch overflow-hidden rounded-tl-[4px] rounded-tr-[4px] bg-surface-10 px-my-24 pb-my-16 pt-my-24 lg:pt-my-40";

export const modalFooterShellClassName =
  "self-stretch overflow-hidden rounded-bl-[4px] rounded-br-[4px] bg-surface-10";

export const modalFooterButtonRowClassName =
  "inline-flex h-my-64 min-h-my-64 w-full items-center gap-my-8 self-stretch bg-surface-10 px-my-24 pb-my-20 pt-my-8";

export const modalFooterButtonToneClassName = {
  secondary:
    "h-my-36 min-w-my-80 rounded-md border border-border-20 bg-surface-10 px-my-12 font-['Pretendard_JP'] text-body1_500 text-on-surface-10 shadow-none hover:bg-surface-20",
  primary:
    "h-my-36 min-w-my-80 rounded-md bg-primary px-my-12 font-['Pretendard_JP'] text-body1_500 text-primary-foreground shadow-none hover:bg-primary/90",
  destructive:
    "h-my-36 min-w-my-80 rounded-md bg-error-error px-my-12 font-['Pretendard_JP'] text-body1_500 text-white shadow-none hover:bg-error-error/90 disabled:opacity-50",
} as const;
