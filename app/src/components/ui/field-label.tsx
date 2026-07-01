"use client";

import { useId } from "react";

import {
  FieldLabel as DsFieldLabel,
  type FieldLabelProps,
} from "design-system/ui/field-label";

export {
  FieldLabel,
  fieldLabelTitleVariants,
  type FieldLabelProps,
} from "design-system/ui/field-label";

/** `Title1` 텍스트 끝 `*` → 라벨 문구 + 필수 여부 */
export function parseRequiredLabelText(title: string): {
  label: string;
  required: boolean;
} {
  const trimmed = title.trimEnd();
  if (trimmed.endsWith("*")) {
    return { label: trimmed.slice(0, -1).trimEnd(), required: true };
  }
  return { label: title, required: false };
}

export function fieldLabelDescriptionId(
  inputId: string,
  hasDescription = true,
): string | undefined {
  return hasDescription ? `${inputId}-desc` : undefined;
}

export type FormFieldLabelProps = Omit<
  FieldLabelProps,
  "children" | "required" | "description" | "descriptionId" | "htmlFor"
> & {
  /** `Title1` `text` 호환 — 끝 `*`는 `required`로 변환 */
  title: string;
  /** `Title1` `subtitleText` 호환 */
  subtitle?: string;
  /** 연결할 컨트롤 id — 미지정 시 자동 생성 */
  inputId?: string;
  htmlFor?: string;
};

/**
 * 폼 필드 라벨 — `Title1`·`ProfileFieldLabel` 마이그레이션용 DS `FieldLabel` 래퍼.
 * `inputId`를 넘기면 동일 id로 `htmlFor`·`descriptionId`를 맞춥니다.
 */
export function FormFieldLabel({
  title,
  subtitle,
  inputId: inputIdProp,
  htmlFor: htmlForProp,
  size = "default",
  ...props
}: FormFieldLabelProps) {
  const autoId = useId().replace(/:/g, "");
  const inputId = inputIdProp ?? htmlForProp ?? autoId;
  const htmlFor = htmlForProp ?? inputIdProp ?? inputId;
  const { label, required } = parseRequiredLabelText(title);
  const descriptionId = subtitle
    ? fieldLabelDescriptionId(inputId, true)
    : undefined;

  return (
    <DsFieldLabel
      size={size}
      htmlFor={htmlFor}
      required={required}
      description={subtitle}
      descriptionId={descriptionId}
      {...props}
    >
      {label}
    </DsFieldLabel>
  );
}

/** 컨트롤 `aria-describedby` — `FormFieldLabel`·`FieldLabel`과 쌍으로 사용 */
export function formFieldAriaDescribedBy(
  inputId: string,
  hasDescription = true,
): string | undefined {
  return fieldLabelDescriptionId(inputId, hasDescription);
}
