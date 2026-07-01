"use client";

import { useId } from "react";

import { FormFieldLabel, formFieldAriaDescribedBy } from "@/components/ui/field-label";
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
    <div className="flex flex-col gap-1">
      <FormFieldLabel title={title} subtitle={subtitle} inputId={inputId} />
      <InputGroup className="mt-1">
        <Input
          ref={inputRef}
          id={inputId}
          aria-describedby={formFieldAriaDescribedBy(inputId, Boolean(subtitle))}
          type="text"
          size="lg"
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
