"use client";

import {
  analyticsFilledSecondaryChipClassName,
  analyticsOutlineChipClassName,
} from "@/components/analytics/analytics-filter-chips";
import { Button } from "@/components/ui/button";
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
      className={cn("inline-flex shrink-0 items-center gap-1", className)}
    >
      {RANGE_OPTIONS.map((option) => {
        const selected = value === option.value;
        return selected ? (
          <button
            key={option.value}
            type="button"
            aria-pressed
            onClick={() => onChange(option.value)}
            className={cn(analyticsFilledSecondaryChipClassName, "h-8 min-w-0 px-2.5 text-xs")}
          >
            {option.label}
          </button>
        ) : (
          <Button
            key={option.value}
            type="button"
            variant="outline"
            size="sm"
            aria-pressed={false}
            onClick={() => onChange(option.value)}
            className={cn(analyticsOutlineChipClassName, "h-8 min-w-0 px-2.5 text-xs")}
          >
            {option.label}
          </Button>
        );
      })}
    </div>
  );
}
