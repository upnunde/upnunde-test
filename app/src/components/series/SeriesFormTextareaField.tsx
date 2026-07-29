"use client";

import { useId } from "react";

import { FormFieldLabel, formFieldAriaDescribedBy } from "@/components/ui/field-label";
import { InputGroup, InputHypertext } from "@/components/ui/input";
import { Textarea } from "design-system/ui/textarea";
import { cn } from "design-system/utils";

interface SeriesFormTextareaFieldProps {
  title: string;
  subtitle: string;
  value: string;
  placeholder: string;
  maxLength: number;
  rows: number;
  error: boolean;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  minHeightClassName?: string;
  onValueChange: (value: string) => void;
}

export function SeriesFormTextareaField({
  title,
  subtitle,
  value,
  placeholder,
  maxLength,
  rows,
  error,
  textareaRef,
  minHeightClassName = "min-h-[160px]",
  onValueChange,
}: SeriesFormTextareaFieldProps) {
  const inputId = useId().replace(/:/g, "");

  return (
    <div className="flex flex-col gap-1">
      <FormFieldLabel title={title} subtitle={subtitle} inputId={inputId} />
      <InputGroup className="mt-1">
        <Textarea
          ref={textareaRef}
          id={inputId}
          aria-describedby={formFieldAriaDescribedBy(inputId, Boolean(subtitle))}
          rows={rows}
          maxLength={maxLength}
          value={value}
          onChange={(e) => onValueChange(e.target.value)}
          placeholder={placeholder}
          aria-invalid={error}
          className={cn("max-h-[400px] resize-y", minHeightClassName)}
        />
        <InputHypertext
          id={formFieldAriaDescribedBy(inputId, Boolean(subtitle))}
          count={value.length}
          max={maxLength}
          variant={error ? "error" : "default"}
        />
      </InputGroup>
    </div>
  );
}
