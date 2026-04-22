"use client";

import { Title1 } from "@/components/ui/title1";
import { cn } from "@/lib/utils";

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
  return (
    <div className="flex flex-col gap-1">
      <Title1 text={title} variant="title-subtitle-dot" subtitleText={subtitle} />
      <textarea
        ref={textareaRef}
        rows={rows}
        maxLength={maxLength}
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        placeholder={placeholder}
        className={cn(
          "mt-1 w-full max-h-[400px] resize-y rounded-md border bg-white px-3 py-2 text-sm text-on-surface-10 placeholder:text-on-surface-30 focus:outline-none focus:ring-2",
          minHeightClassName,
          error ? "border-destructive focus:ring-destructive/40" : "border-slate-200 focus:ring-primary"
        )}
      />
      <div className="flex justify-end text-xs text-on-surface-30">
        {value.length}/{maxLength}
      </div>
    </div>
  );
}
