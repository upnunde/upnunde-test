"use client";

import { useId } from "react";

import { FormFieldLabel, formFieldAriaDescribedBy } from "@/components/ui/field-label";
import { FORM_LABEL_CONTROL_STACK_CLASS } from "@/lib/form-field-styles";
import { Input, InputGroup, InputHypertext } from "@/components/ui/input";

interface SeriesFormTextInputFieldProps {
  title: string;
  subtitle: string;
  value: string;
  placeholder: string;
  maxLength: number;
  error: boolean;
  inputRef: React.RefObject<HTMLInputElement | null>;
  onValueChange: (value: string) => void;
}

export function SeriesFormTextInputField({
  title,
  subtitle,
  value,
  placeholder,
  maxLength,
  error,
  inputRef,
  onValueChange,
}: SeriesFormTextInputFieldProps) {
  const inputId = useId().replace(/:/g, "");

  return (
    <div className={FORM_LABEL_CONTROL_STACK_CLASS}>
      <FormFieldLabel title={title} subtitle={subtitle} inputId={inputId} />
      <InputGroup>
        <Input
          ref={inputRef}
          id={inputId}
          aria-describedby={formFieldAriaDescribedBy(inputId, Boolean(subtitle))}
          type="text"
          size="xl"
          maxLength={maxLength}
          value={value}
          onChange={(e) => onValueChange(e.target.value)}
          placeholder={placeholder}
          aria-invalid={error}
        />
        <InputHypertext count={value.length} max={maxLength} variant={error ? "error" : "default"} />
      </InputGroup>
    </div>
  );
}
