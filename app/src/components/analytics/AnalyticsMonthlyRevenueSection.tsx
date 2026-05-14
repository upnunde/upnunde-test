"use client";

import { useEffect, useMemo, useState } from "react";
import { AnalyticsMonthlyRevenueBars } from "@/components/analytics/AnalyticsMonthlyRevenueBars";
import { getMonetizationMonthlyRevenue } from "@/components/analytics/analytics-dummy-by-scope";
import type { AnalyticsScopeCategoryId } from "@/components/analytics/analytics-scope-category";
import type { AnalyticsCharacterId } from "@/components/analytics/analytics-character-options";
import type { AnalyticsSeriesId } from "@/components/analytics/analytics-series-options";
import { cn } from "@/lib/utils";

export const MONTHLY_REVENUE_PAGE_SIZE = 6;
export const MONTHLY_REVENUE_MAX_MONTHS = 24;

export function AnalyticsMonthlyRevenueSection({
  scopeCategory,
  seriesId,
  characterId,
  className,
}: {
  scopeCategory: AnalyticsScopeCategoryId;
  seriesId: AnalyticsSeriesId;
  characterId: AnalyticsCharacterId;
  className?: string;
}) {
  const [visibleMonths, setVisibleMonths] = useState(MONTHLY_REVENUE_PAGE_SIZE);

  useEffect(() => {
    setVisibleMonths(MONTHLY_REVENUE_PAGE_SIZE);
  }, [scopeCategory, seriesId, characterId]);

  const rows = useMemo(
    () => getMonetizationMonthlyRevenue(scopeCategory, seriesId, characterId, visibleMonths),
    [scopeCategory, seriesId, characterId, visibleMonths],
  );

  const canLoadMore = visibleMonths < MONTHLY_REVENUE_MAX_MONTHS;

  return (
    <div className={cn("flex flex-col", className)}>
      <AnalyticsMonthlyRevenueBars rows={rows} />
      {canLoadMore ? (
        <button
          type="button"
          onClick={() => setVisibleMonths((count) => count + MONTHLY_REVENUE_PAGE_SIZE)}
          className="mt-4 w-full rounded-md py-2 text-center text-sm font-medium text-on-surface-20 transition-colors hover:bg-surface-20 hover:text-on-surface-10"
        >
          더보기
        </button>
      ) : null}
    </div>
  );
}
