import { cn } from "@/lib/utils";

/** 텍스트·텍스트에어리어 공통 포커스 (에피소드 폼 등과 동일) */
export const formFieldFocusClassName =
  "focus:outline-none focus:ring-2 focus:ring-primary";

/** 폼 텍스트 필드 공통 베이스 */
export const formTextFieldBaseClassName =
  "rounded-md border border-border-10 bg-white text-sm text-on-surface-10 placeholder:text-on-surface-30";

export const formTextFieldSmClassName = cn(
  formTextFieldBaseClassName,
  formFieldFocusClassName,
  "h-10 px-3",
);

export const formTextFieldMdClassName = cn(
  formTextFieldBaseClassName,
  formFieldFocusClassName,
  "h-12 px-3 py-2",
);

export const formTextAreaClassName = cn(
  formTextFieldBaseClassName,
  formFieldFocusClassName,
  "px-3 py-2",
);
