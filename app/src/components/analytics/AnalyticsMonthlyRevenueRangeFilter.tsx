"use client";

import { FilterChip } from "@/components/ui/chip";
import { CHIP_GROUP_GAP_CLASS } from "@/lib/chip-styles";
import { cn } from "@/lib/utils";

export type MonthlyRevenueRangeMonths = 6 | 12;

export const DEFAULT_MONTHLY_REVENUE_RANGE_MONTHS: MonthlyRevenueRangeMonths = 6;

const RANGE_OPTIONS: ReadonlyArray<{ value: MonthlyRevenueRangeMonths; label: string }> = [
  { value: 6, label: "6개월" },
  { value: 12, label: "1년" },
];

/** 월별 수익 패널 — 6개월 / 1년 단일 클릭 필터 */
export function AnalyticsMonthlyRevenueRangeFilter({
  value,
  onChange,
  className,
}: {
  value: MonthlyRevenueRangeMonths;
  onChange: (next: MonthlyRevenueRangeMonths) => void;
  className?: string;
}) {
  return (
    <div
      role="group"
      aria-label="월별 수익 표시 기간"
      className={cn("inline-flex shrink-0 items-center", CHIP_GROUP_GAP_CLASS, className)}
    >
      {RANGE_OPTIONS.map((option) => {
        const selected = value === option.value;
        return (
          <FilterChip
            key={option.value}
            selected={selected}
            chipSize="m"
            aria-pressed={selected}
            className="min-w-0"
            onClick={() => onChange(option.value)}
          >
            {option.label}
          </FilterChip>
        );
      })}
    </div>
  );
}
