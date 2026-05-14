"use client";

import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { analyticsOutlineChipClassName } from "@/components/analytics/analytics-filter-chips";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type AnalyticsScopeDropdownOption = {
  id: string;
  label: string;
};

/** 분석 필터 — 작품·캐릭터·회차 등 단일 선택 드롭다운 */
export function AnalyticsScopeDropdown({
  value,
  onChange,
  options,
  ariaLabelPrefix,
  placeholder = "선택",
  align = "start",
  className,
}: {
  value: string;
  onChange: (id: string) => void;
  options: readonly AnalyticsScopeDropdownOption[];
  ariaLabelPrefix: string;
  placeholder?: string;
  align?: "start" | "end";
  className?: string;
}) {
  const label = options.find((o) => o.id === value)?.label ?? placeholder;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="lg"
          className={cn(analyticsOutlineChipClassName, "max-w-[280px] justify-between gap-1", className)}
          aria-label={`${ariaLabelPrefix} — ${label}`}
          title={label}
        >
          <span className="min-w-0 max-w-[240px] truncate">{label}</span>
          <ChevronDown className="h-5 w-5 shrink-0 text-on-surface-10" aria-hidden />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align} className="min-w-[220px]">
        <DropdownMenuRadioGroup value={value} onValueChange={onChange}>
          {options.map((opt) => (
            <DropdownMenuRadioItem key={opt.id} value={opt.id}>
              {opt.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
