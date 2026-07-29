"use client";

import { Tabs, TabsList, TabsTrigger } from "design-system/ui/tabs";

export type MonthlyRevenueRangeMonths = 6 | 12;

export const DEFAULT_MONTHLY_REVENUE_RANGE_MONTHS: MonthlyRevenueRangeMonths = 6;

const RANGE_OPTIONS: ReadonlyArray<{ value: MonthlyRevenueRangeMonths; label: string }> = [
  { value: 6, label: "6개월" },
  { value: 12, label: "1년" },
];

/** 월별 수익 패널 — 6개월 / 1년 DS Tabs 필터 */
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
    <Tabs value={String(value)} onValueChange={(v) => onChange(Number(v) as MonthlyRevenueRangeMonths)} className={className}>
      <TabsList variant="line" size="sm" aria-label="월별 수익 표시 기간">
        {RANGE_OPTIONS.map(({ value: v, label }) => (
          <TabsTrigger key={String(v)} value={String(v)}>{label}</TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
