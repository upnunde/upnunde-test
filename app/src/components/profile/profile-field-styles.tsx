import {
  FieldLabel,
  FormFieldLabel,
  formFieldAriaDescribedBy,
  parseRequiredLabelText,
  fieldLabelDescriptionId,
  type FormFieldLabelProps,
} from "@/components/ui/field-label";
import { InputHypertext } from "@/components/ui/input";
import { cn } from "design-system/utils";

/** @deprecated `FieldLabel` 또는 `FormFieldLabel`을 사용하세요. */
export function ProfileFieldLabel({
  text,
  hint,
  htmlFor,
}: {
  text: string;
  hint?: string;
  htmlFor?: string;
}) {
  return (
    <FieldLabel
      size="default"
      htmlFor={htmlFor}
      description={hint}
      descriptionId={hint && htmlFor ? fieldLabelDescriptionId(htmlFor) : undefined}
    >
      {text}
    </FieldLabel>
  );
}

/** @deprecated `InputHypertext`의 `count`/`max`를 사용하세요. */
export function ProfileCharCount({ current, max }: { current: number; max: number }) {
  return <InputHypertext count={current} max={max} className="justify-end" />;
}

export function profileTabButtonClassName(active: boolean): string {
  return cn(
    "flex h-9 min-w-0 cursor-pointer items-center justify-center gap-2 text-body1_700",
    active
      ? "border-b-2 border-border-strong text-foreground"
      : "text-foreground-disabled",
  );
}

export { FormFieldLabel, formFieldAriaDescribedBy, parseRequiredLabelText };
