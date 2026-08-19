"use client";

import { useId } from "react";

import { FormFieldLabel, formFieldAriaDescribedBy } from "@/components/ui/field-label";
import { InputGroup, InputHypertext } from "@/components/ui/input";
import { Button } from "design-system/ui/button";
import { Textarea } from "design-system/ui/textarea";
import { cn } from "design-system/utils";

interface SeriesFormTextareaFieldProps {
  title: string;
  subtitle: string;
  value: string;
  placeholder: string;
  maxLength: number;
  rows?: number;
  error: boolean;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  minHeightClassName?: string;
  onValueChange: (value: string) => void;
  /** 텍스트영역 우측 상단 액션 (예: 자동완성) */
  actionLabel?: string;
  onAction?: () => void;
  actionDisabled?: boolean;
  actionLoading?: boolean;
}

export function SeriesFormTextareaField({
  title,
  subtitle,
  value,
  placeholder,
  maxLength,
  rows = 6,
  error,
  textareaRef,
  minHeightClassName,
  onValueChange,
  actionLabel,
  onAction,
  actionDisabled = false,
  actionLoading = false,
}: SeriesFormTextareaFieldProps) {
  const inputId = useId().replace(/:/g, "");
  const isAtMaxLength = value.length >= maxLength;
  const showMaxLengthState = error || isAtMaxLength;
  const showAction = Boolean(actionLabel && onAction);

  return (
    <div className="flex flex-col gap-1">
      <FormFieldLabel title={title} subtitle={subtitle} inputId={inputId} />
      <InputGroup className="mt-1">
        <div className="relative">
          <Textarea
            ref={textareaRef}
            id={inputId}
            aria-describedby={formFieldAriaDescribedBy(inputId, Boolean(subtitle))}
            rows={rows}
            maxLength={maxLength}
            value={value}
            onChange={(e) => onValueChange(e.target.value)}
            placeholder={placeholder}
            aria-invalid={showMaxLengthState}
            className={cn(
              "max-h-[400px] resize-y",
              showAction && "pb-12",
              minHeightClassName,
            )}
          />
          {showAction ? (
            <Button
              type="button"
              variant="secondary"
              shape="square"
              size="sm"
              tone="brand"
              className="absolute right-2 bottom-2"
              disabled={actionDisabled || actionLoading || value.trim().length === 0}
              onClick={onAction}
            >
              {actionLoading ? "정리 중" : actionLabel}
            </Button>
          ) : null}
        </div>
        <InputHypertext
          id={formFieldAriaDescribedBy(inputId, Boolean(subtitle))}
          count={value.length}
          max={maxLength}
          variant={showMaxLengthState ? "error" : "default"}
        />
      </InputGroup>
    </div>
  );
}
