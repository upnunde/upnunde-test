"use client";

import { useMemo } from "react";
import { AnalyticsMonthlyRevenueBars } from "@/components/analytics/AnalyticsMonthlyRevenueBars";
import type { MonthlyRevenueRangeMonths } from "@/components/analytics/AnalyticsMonthlyRevenueRangeFilter";
import { getMonetizationMonthlyRevenue } from "@/components/analytics/analytics-dummy-by-scope";
import type { AnalyticsScopeCategoryId } from "@/components/analytics/analytics-scope-category";
import type { AnalyticsCharacterId } from "@/components/analytics/analytics-character-options";
import type { AnalyticsScenarioId } from "@/components/analytics/analytics-scenario-options";
import type { AnalyticsSeriesId } from "@/components/analytics/analytics-series-options";
import { cn } from "@/lib/utils";

export function AnalyticsMonthlyRevenueSection({
  scopeCategory,
  seriesId,
  characterId,
  scenarioId,
  monthCount,
  className,
}: {
  scopeCategory: AnalyticsScopeCategoryId;
  seriesId: AnalyticsSeriesId;
  characterId: AnalyticsCharacterId;
  scenarioId: AnalyticsScenarioId;
  monthCount: MonthlyRevenueRangeMonths;
  className?: string;
}) {
  const rows = useMemo(
    () =>
      getMonetizationMonthlyRevenue(
        scopeCategory,
        seriesId,
        characterId,
        scenarioId,
        monthCount,
      ),
    [scopeCategory, seriesId, characterId, scenarioId, monthCount],
  );

  return (
    <div className={cn("flex flex-col", className)}>
      <AnalyticsMonthlyRevenueBars rows={rows} />
    </div>
  );
}
