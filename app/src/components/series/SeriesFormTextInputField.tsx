"use client";

import { Title1 } from "@/components/ui/title1";
import { cn } from "@/lib/utils";

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
  return (
    <div className="flex flex-col gap-1">
      <Title1 text={title} variant="title-subtitle-dot" subtitleText={subtitle} />
      <input
        ref={inputRef}
        type="text"
        maxLength={maxLength}
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        placeholder={placeholder}
        className={cn(
          "mt-1 h-12 w-full rounded-md border bg-white px-3 py-2 text-sm text-on-surface-10 placeholder:text-on-surface-30 focus:outline-none focus:ring-2",
          error ? "border-destructive focus:ring-destructive/40" : "border-slate-200 focus:ring-primary"
        )}
      />
      <div className="flex justify-end text-xs text-on-surface-30">
        {value.length}/{maxLength}
      </div>
    </div>
  );
}
