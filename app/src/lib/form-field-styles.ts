import {
  CONTROL_HEIGHT_FORM_CLASS,
  CONTROL_HEIGHT_STANDARD_CLASS,
} from "@/lib/chip-styles";
import { cn } from "design-system/utils";

/**
 * FieldLabel → 하단 컨트롤 **8px** (전 size 공통).
 * DS 정본은 `InputGroup` `gap-2` (`FIELD_LABEL_CONTROL_GAP_GROUP_CLASS`).
 * 라벨이 InputGroup 밖에 있을 때 이 스택 `gap-2`를 쓴다. `gap-2`와 `mt-2`를 동시에 쓰지 말 것.
 */
export const FORM_LABEL_CONTROL_STACK_CLASS = "flex flex-col gap-2";

/** 텍스트·텍스트에어리어 공통 포커스 (에피소드 폼 등과 동일) */
export const formFieldFocusClassName =
  "focus:outline-none focus:ring-2 focus:ring-primary";

/** 폼 텍스트 필드 공통 베이스 */
export const formTextFieldBaseClassName =
  "rounded-md border border-border bg-background max-lg:text-body1_400 lg:text-body3_400 text-foreground placeholder:text-foreground-placeholder";

/** form·md 필드 안쪽 여백 — spacing-8 = 8px */
export const formFieldPadClassName = "px-2 py-2";

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
