/** 가이드 modal 셸 — 480px, Header/Footer 분리 프레임 */
export const modalDialogContentClassName =
  "flex w-[480px] max-w-[calc(100vw-2rem)] flex-col items-stretch gap-0 overflow-hidden border-0 bg-surface-10 p-0 shadow-elevation-50 rounded-[4px]";

export const modalHeaderClassName =
  "flex min-h-40 w-full flex-col items-center gap-my-20 self-stretch overflow-hidden rounded-tl-[4px] rounded-tr-[4px] bg-surface-10 px-my-24 pb-my-16 pt-my-40";

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
