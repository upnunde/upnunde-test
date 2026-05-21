import {
  CONTROL_HEIGHT_FORM_CLASS,
  CONTROL_HEIGHT_STANDARD_CLASS,
} from "@/lib/chip-styles";
import { cn } from "@/lib/utils";

/** 텍스트·텍스트에어리어 공통 포커스 (에피소드 폼 등과 동일) */
export const formFieldFocusClassName =
  "focus:outline-none focus:ring-2 focus:ring-primary";

/** 폼 텍스트 필드 공통 베이스 */
export const formTextFieldBaseClassName =
  "rounded-md border border-border-10 bg-white text-sm text-on-surface-10 placeholder:text-on-surface-30";

/** form·md 필드 안쪽 여백 — spacing-8 = 8px */
export const formFieldPadClassName = "px-[8px] py-[8px]";

export const formTextFieldSmClassName = cn(
  formTextFieldBaseClassName,
  formFieldFocusClassName,
  CONTROL_HEIGHT_STANDARD_CLASS,
  "px-3",
);

export const formTextFieldMdClassName = cn(
  formTextFieldBaseClassName,
  formFieldFocusClassName,
  CONTROL_HEIGHT_FORM_CLASS,
  formFieldPadClassName,
);

export const formTextAreaClassName = cn(
  formTextFieldBaseClassName,
  formFieldFocusClassName,
  "px-3 py-2",
);
