/** 가이드 modal 셸 — 480px, Header/Footer 분리 프레임 */
export const modalDialogContentClassName =
  "flex w-[480px] max-w-[calc(100vw-2rem)] flex-col items-stretch gap-0 overflow-hidden border-0 bg-surface-10 p-0 shadow-[0px_8px_16px_8px_rgba(0,0,0,0.16)] rounded-2xl";

export const modalHeaderClassName =
  "flex min-h-40 w-full flex-col items-center gap-5 self-stretch overflow-hidden rounded-tl-2xl rounded-tr-2xl bg-surface-10 px-6 pb-4 pt-10";

export const modalFooterShellClassName =
  "self-stretch overflow-hidden rounded-bl-2xl rounded-br-2xl bg-surface-10";

export const modalFooterButtonRowClassName =
  "inline-flex h-16 min-h-16 w-full items-center gap-2 self-stretch bg-surface-10 px-6 pb-5 pt-2";

export const modalFooterButtonToneClassName = {
  secondary:
    "h-9 min-w-20 rounded-md border border-border-20 bg-surface-10 px-3 font-['Pretendard_JP'] text-base font-medium leading-5 text-on-surface-10 shadow-none hover:bg-surface-20",
  primary:
    "h-9 min-w-20 rounded-md bg-primary px-3 font-['Pretendard_JP'] text-base font-medium leading-5 text-primary-foreground shadow-none hover:bg-primary/90",
  destructive:
    "h-9 min-w-20 rounded-md bg-error-error px-3 font-['Pretendard_JP'] text-base font-medium leading-5 text-white shadow-none hover:bg-error-error/90 disabled:opacity-50",
} as const;
