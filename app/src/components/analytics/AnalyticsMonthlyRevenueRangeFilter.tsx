"use client";

import { SegmentedTextTabs } from "@/components/ui/segmented-text-tabs";

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
    <SegmentedTextTabs
      aria-label="월별 수익 표시 기간"
      className={className}
      size="m"
      items={RANGE_OPTIONS.map(({ value: id, label }) => ({ id: String(id), label }))}
      activeId={String(value)}
      onSelect={(id) => onChange(Number(id) as MonthlyRevenueRangeMonths)}
    />
  );
}
