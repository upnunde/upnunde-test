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
    <div className="flex flex-col gap-my-4">
      <Title1 text={title} variant="title-subtitle-dot" subtitleText={subtitle} />
      <input
        ref={inputRef}
        type="text"
        maxLength={maxLength}
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        placeholder={placeholder}
        className={cn(
          "mt-1 h-[42px] w-full rounded-md border bg-white px-my-12 py-my-8 text-body3_400 text-on-surface-10 placeholder:text-on-surface-30 focus:outline-none focus:ring-2",
          error ? "border-destructive focus:ring-destructive/40" : "border-border-10 focus:ring-primary"
        )}
      />
      <div className="flex justify-end text-caption1_400 text-on-surface-30">
        {value.length}/{maxLength}
      </div>
    </div>
  );
}
