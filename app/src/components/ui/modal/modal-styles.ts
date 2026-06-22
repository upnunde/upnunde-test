import { cn } from "@/lib/utils";
import {
  MOBILE_BOTTOM_SHEET_PAD_CLASS,
  MOBILE_FIXED_BOTTOM_ANCHOR_CLASS,
  MOBILE_FIXED_BOTTOM_BAR_SHELL_CLASS,
  MOBILE_FIXED_BOTTOM_SAFE_PAD_CLASS,
} from "@/lib/mobile-viewport";

/** z-index: 커스텀 포털 바텀시트 < Radix Dialog < 토스트 */
export const MOBILE_BOTTOM_SHEET_SCRIM_Z_CLASS = "z-[60]";
export const MOBILE_BOTTOM_SHEET_PANEL_Z_CLASS = "z-[61]";
export const DIALOG_OVERLAY_Z_CLASS = "z-[70]";
export const DIALOG_CONTENT_Z_CLASS = "z-[71]";
export const TOAST_STACK_Z_CLASS = "z-[80]";

/** radius-16 — 모바일 바텀 시트 상단 모서리 */
export const MOBILE_MODAL_TOP_RADIUS_CLASS = "rounded-t-[16px]";

/** 모바일 바텀 시트 — 화면 하단에 붙으므로 하단 모서리 라운드 없음 */
export const MOBILE_BOTTOM_SHEET_BOTTOM_RADIUS_CLASS = "rounded-b-none";

/** radius-16 — 모바일 중앙·팝업 모달 전체 모서리 */
export const MOBILE_MODAL_RADIUS_CLASS = "max-lg:rounded-[16px]";

/** 데스크톱 모달 컨테이너 — radius-4 */
export const DESKTOP_MODAL_RADIUS_CLASS = "lg:rounded-[4px]";

/** 확인·삭제 alert — max 420px, 뷰포트 좌우 40px(my-40) inset */
export const CONFIRM_DIALOG_WIDTH_CLASS =
  "w-full max-w-[min(420px,calc(100vw-var(--spacing-my-40)*2))]";

/** 가이드 modal 셸 — Header/Footer 분리 프레임 */
export const modalDialogContentClassName = cn(
  "flex flex-col items-stretch gap-0 overflow-hidden border-0 bg-surface-10 p-0 shadow-elevation-50",
  CONFIRM_DIALOG_WIDTH_CLASS,
  MOBILE_MODAL_RADIUS_CLASS,
  DESKTOP_MODAL_RADIUS_CLASS,
);

/**
 * M3 Large detent — 상단 ~8% peek · 폼·긴 목록·히스토리.
 * `dialog.tsx` `presentation="auto"`, `formDialogShellClassName`과 동일.
 */
export const mobileBottomSheetLargeMaxHeightClassName = "max-h-[min(92dvh,900px)]";

/** @deprecated `mobileBottomSheetLargeMaxHeightClassName` 별칭 */
export const mobileBottomSheetMaxHeightClassName = mobileBottomSheetLargeMaxHeightClassName;

/**
 * M3 Medium detent — 상단 20% peek · 피커·짧은 액션 목록·블록 추가.
 */
export const mobileBottomSheetMediumMaxHeightClassName = "max-h-[80dvh]";

/** @deprecated `mobileBottomSheetMediumMaxHeightClassName` 별칭 */
export const mobileResourcePickerSheetMaxHeightClassName = mobileBottomSheetMediumMaxHeightClassName;

/** 모바일 바텀 시트 스크림 — 키보드 포함 현재 visual viewport를 덮어 딤 밀림 방지, 탭으로 닫기 */
export const MOBILE_BOTTOM_SHEET_SCRIM_CLASS = cn(
  "fixed inset-x-0 bottom-0 top-0 touch-none bg-black/30",
  "max-lg:bottom-auto max-lg:top-[var(--app-vv-live-top,0px)] max-lg:h-[var(--app-vv-live-height,100dvh)]",
  MOBILE_BOTTOM_SHEET_SCRIM_Z_CLASS,
);

/** 모바일 바텀 시트 패널 — 스크림 위 */
export const MOBILE_BOTTOM_SHEET_PANEL_CLASS = cn(
  "fixed inset-x-0",
  MOBILE_BOTTOM_SHEET_PANEL_Z_CLASS,
);

/** 모바일 바텀 시트 공통 셸 — radius-16 상단 · 패딩 · 보더 (max-height는 호출부에서 추가) */
export const MOBILE_BOTTOM_SHEET_SHELL_BASE_CLASS = cn(
  MOBILE_BOTTOM_SHEET_PANEL_CLASS,
  "flex min-h-0 flex-col border-t border-border-10 bg-white shadow-elevation-40",
  MOBILE_MODAL_TOP_RADIUS_CLASS,
  MOBILE_BOTTOM_SHEET_BOTTOM_RADIUS_CLASS,
  MOBILE_BOTTOM_SHEET_PAD_CLASS,
);

export {
  MOBILE_BOTTOM_SHEET_PAD_CLASS,
  MOBILE_FIXED_BOTTOM_ANCHOR_CLASS,
  MOBILE_FIXED_BOTTOM_BAR_SHELL_CLASS,
  MOBILE_FIXED_BOTTOM_SAFE_PAD_CLASS,
};

/** 넓은 폼 Dialog 셸 — 모바일 full-width 바텀 시트 / 데스크톱 중앙(콘텐츠 높이, 길면 max-h에서 스크롤) */
export const formDialogShellClassName = cn(
  "flex min-w-0 flex-col overflow-hidden border-0 bg-transparent p-0 shadow-none",
  "max-lg:h-[min(92dvh,900px)] max-lg:max-w-none max-lg:w-full max-lg:bg-white max-lg:shadow-elevation-50 max-lg:pb-0",
  MOBILE_MODAL_TOP_RADIUS_CLASS,
  MOBILE_BOTTOM_SHEET_BOTTOM_RADIUS_CLASS,
  "lg:h-auto lg:max-h-[min(90vh,calc(100dvh-80px))] lg:w-[min(92vw,760px)] lg:max-w-[760px] lg:gap-0 lg:overflow-hidden lg:p-0 lg:rounded-[4px]",
);

/** 바텀 시트 안 폼 본문 — EpisodeForm 등 */
export const formDialogSheetEpisodeFormClassName =
  "w-full mx-0 max-w-none min-w-0 flex-1 min-h-0 rounded-none border-0 bg-white shadow-none lg:rounded-[4px] lg:border lg:border-border-10";

/** 바텀 시트 내부 래퍼 — 헤더·푸터 사이 flex 체인 */
export const formDialogSheetBodyWrapperClassName =
  "flex min-h-0 flex-1 flex-col overflow-hidden";

/** 바텀 시트·폼 모달 스크롤 본문 — 고정 푸터 위 스크롤 영역 */
export const formDialogSheetScrollBodyClassName =
  "min-h-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-contain pb-my-20";

/** 바텀 시트·폼 모달 하단 고정 버튼 영역 — 모바일 safe-area·브라우저 하단 크롬 포함 */
export const formDialogSheetStickyFooterClassName = cn(
  "mt-auto shrink-0 border-t border-border-10 bg-white px-my-20 pt-my-16 pb-my-16",
  "max-lg:pb-[calc(var(--spacing-my-16)+env(safe-area-inset-bottom,0px))]",
);

export const modalHeaderClassName = cn(
  "flex min-h-40 w-full flex-col items-center gap-my-20 self-stretch overflow-hidden bg-surface-10 px-my-24 pb-my-16 pt-my-24",
  "max-lg:rounded-t-[16px] lg:rounded-tl-[4px] lg:rounded-tr-[4px] lg:pt-my-40",
);

export const modalFooterShellClassName = cn(
  "self-stretch overflow-hidden bg-surface-10",
  MOBILE_BOTTOM_SHEET_BOTTOM_RADIUS_CLASS,
  "lg:rounded-bl-[4px] lg:rounded-br-[4px]",
);

export const modalFooterButtonRowClassName = cn(
  "flex w-full flex-col items-stretch gap-my-8 self-stretch bg-surface-10 px-my-24 pb-my-20 pt-my-8",
  "max-lg:py-my-16",
  "lg:inline-flex lg:h-my-64 lg:min-h-my-64 lg:flex-row lg:items-center",
);

/** split 레이아웃 — 모바일 세로 스택 / 데스크톱 우측 버튼 그룹 */
export const modalFooterTrailingGroupClassName =
  "flex w-full flex-col items-stretch gap-my-8 lg:w-auto lg:flex-row lg:items-center lg:justify-start";

export const modalFooterButtonToneClassName = {
  secondary:
    "h-my-36 w-full min-w-0 rounded-md border border-border-20 bg-surface-10 px-my-12 font-['Pretendard_JP'] text-body1_500 text-on-surface-10 shadow-none hover:bg-surface-20 lg:w-auto lg:min-w-my-80",
  primary:
    "h-my-36 w-full min-w-0 rounded-md bg-primary px-my-12 font-['Pretendard_JP'] text-body1_500 text-primary-foreground shadow-none hover:bg-primary/90 lg:w-auto lg:min-w-my-80",
  destructive:
    "h-my-36 w-full min-w-0 rounded-md bg-error-error px-my-12 font-['Pretendard_JP'] text-body1_500 text-white shadow-none hover:bg-error-error/90 disabled:opacity-50 lg:w-auto lg:min-w-my-80",
  ghost:
    "h-my-36 w-full min-w-0 rounded-md border-0 bg-transparent px-my-12 font-['Pretendard_JP'] text-body1_500 text-on-surface-30 shadow-none hover:bg-surface-20 hover:text-on-surface-10 lg:w-auto",
} as const;
